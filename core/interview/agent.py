#!/usr/bin/env python3
"""
InterXAI CLI Tool - Adaptive Interview Management System
Uses LangGraph and LangChain for interview flow management with Groq
"""

import os
import sys
import django
from datetime import datetime, timezone
from typing import Dict, List, Optional, TypedDict
from dataclasses import dataclass

# LangChain and LangGraph imports
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field

# Django setup
sys.path.append('/home/sathwik/InterXAI-v2/core')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Import your Django models
from interview.models import (
    Custominterviews, Customquestion, Application, 
    InterviewSession, Interaction, FollowUpQuestions, Customconversation
)

class EvaluationResult(BaseModel):
    score: int = Field(description="Score from 1-10 for the answer")
    feedback: str = Field(description="Detailed feedback on the answer")
    reasoning: str = Field(description="Explanation of the evaluation")
class FollowUpDecision(BaseModel):
    needs_followup: bool = Field(description="Whether a follow-up question is needed")
    followup_question: Optional[str] = Field(
        default=None, description="The follow-up question to ask if needed"
    )
class FollowUpRequest(BaseModel):
    position: str = Field(description="Position for which the interview is being conducted")
    experience: str = Field(description="Required experience level for the position")
    # question: str = Field(description="The main question asked to the candidate")
    expected_answer: str = Field(description="The expected answer for the question")
    conversation_context: List[str] = Field(description="The context for the follow-up question")

class EvaluationRequest(BaseModel):
    position: str = Field(description="Position for which the interview is being conducted")
    experience: str = Field(description="Required experience level for the position")
    question: str = Field(description="The intial question asked to the candidate if there are more questions in the conversation History then they were follow up questions because the candidates response was not satisfied")
    conversation_context: List[str] = Field(description="The context for the follow-up question")
    expected_answer: str = Field(description="The expected answer for the question")
class InterviewState(TypedDict):
    messages: List[BaseMessage]
    current_question: Optional[str]
    main_question: Optional[str]  
    excepted_answer: Optional[str]  
    current_answer: Optional[str]
    session_id: int
    current_interaction: Optional[int]
    questions_asked: int
    followup_count: int
    max_followups: int
    interview_completed: bool
    conversation_context: str
    evaluation_result: Optional[EvaluationResult]  # Add this to TypedDict

@dataclass
class InterviewConfig:
    """Configuration for the interview session"""
    max_followups: int = 3
    min_score_threshold: int = 6
    llm_model: str = "meta-llama/llama-4-scout-17b-16e-instruct"
    temperature: float = 0.7
    max_tokens: int = 2000
    groq_api_key: Optional[str] = None

class InterviewManager:
    """Main class for managing interview sessions"""
    
    def __init__(self, config: InterviewConfig = None):
        self.config = config or InterviewConfig()
        
        # Setup Groq API key
        groq_api_key = self.config.groq_api_key or os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable must be set or passed in config")
        
        # Initialize ChatGroq instead of Ollama
        self.llm = ChatGroq(
            model=self.config.llm_model,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
            groq_api_key=groq_api_key
        )
        
        self.EvaluationParser = JsonOutputParser(pydantic_object=EvaluationResult)
        self.FollowUpParser = JsonOutputParser(pydantic_object=FollowUpDecision)
        self.setup_prompts()
    
    def setup_prompts(self):
        """Setup LangChain prompts for different interview stages"""
        
        # Evaluation prompt
        self.evaluation_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert technical interviewer evaluating candidate responses.

Interview Context:
- Position: {position}
- Experience Required: {experience}

Conversation History:
{conversation_context}

Expected Answer: {expected_answer}
Note: If there are more questions in the conversation history, they are follow-up questions because the candidate's response was not satisfactory 'question' is the main question asked.

Evaluate the answer by comparing it to the expected answer and provide:
1. Score (1-10): Technical accuracy and completeness
2. Feedback: Constructive feedback on the answer
3. Reasoning: Explain your evaluation

IMPORTANT: Only evaluate based on the provided conversation history and the expected answer. Do not ask follow-up questions or make any decisions about clarification.

Focus on:
- Technical correctness
- Depth of understanding
- Communication clarity
- Problem-solving approach

IMPORTANT: Respond with valid JSON only. No additional text or formatting.

Keep feedback and reasoning concise but informative (max 200 words each).

{format_instructions}
            """),
            ("human", "Please evaluate this interview response.")
        ])
        self.follow_up_decider = ChatPromptTemplate.from_messages([
            ("system", """You are an expert technical interviewer evaluating candidate responses.

Interview Context:
- Position: {position}
- Experience Required: {experience}

Conversation History:
{conversation_context}

Expected Answer: {expected_answer}

Note:
- The **first question in the conversation history is the main question**.
- All subsequent questions were asked because the candidate’s previous answers were not satisfactory.
- Always evaluate the **last question and its corresponding answer** in the conversation history as the current question and answer.
- Any follow-up question you propose must be limited strictly to clarifying or completing the main question and should **not go beyond the scope of the main question**.

Evaluate the answer by comparing it to the expected answer and provide:
1. Whether a follow-up question is needed. The answer can include more information than the expected answer, but must not be missing key aspects.
2. If a follow-up question is needed, provide a clear and specific probing question focused only on the main question.
3. If no follow-up is needed, do not include any question.

IMPORTANT: Always compare the candidate answer and expected answer carefully. The candidate may elaborate beyond the expected answer, but if any essential point is missing, a follow-up question must be asked.

Focus on:
- Technical correctness
- Depth of understanding
- Communication clarity
- Problem-solving approach

IMPORTANT: Respond with valid JSON only. No additional text or formatting.

Keep your reasoning concise but informative (max 200 words).

{format_instructions}

"""),
            ("human", "Please evaluate this interview response.")
        ])
        
        # Context builder prompt
        self.context_prompt = ChatPromptTemplate.from_messages([
            ("system", """Summarize the interview conversation so far for context. 
            Include key points discussed, candidate's strengths/weaknesses observed, 
            and areas that need more exploration.
            
            Keep it concise but informative for the next evaluation."""),
            ("human", "{conversation_history}")
        ])
    
    def setup_graph(self):
        """Setup LangGraph workflow for interview management"""
        
        workflow = StateGraph(InterviewState)
        
        # Define nodes
        workflow.add_node("start_interview", self.start_interview_node)
        workflow.add_node("ask_question", self.ask_question_node)
        workflow.add_node("get_answer", self.get_answer_node)
        workflow.add_node("evaluate_answer", self.evaluate_answer_node)
        workflow.add_node("decide_followup", self.decide_followup_node)
        workflow.add_node("ask_followup", self.ask_followup_node)
        workflow.add_node("next_question", self.next_question_node)
        workflow.add_node("conclude_interview", self.conclude_interview_node)
        
        # Define edges
        workflow.set_entry_point("start_interview")
        workflow.add_edge("start_interview", "ask_question")
        workflow.add_edge("ask_question", "get_answer")
        workflow.add_edge("get_answer", "evaluate_answer")
        workflow.add_edge("evaluate_answer", "decide_followup")
        
        workflow.add_conditional_edges(
            "decide_followup",
            self.should_ask_followup,
            {
                "followup": "ask_followup",
                "next": "next_question",
                "end": "conclude_interview"
            }
        )
        
        workflow.add_edge("ask_followup", "get_answer")
        workflow.add_edge("next_question", "ask_question")
        workflow.add_edge("conclude_interview", END)
        
        self.graph = workflow.compile()
    
    def start_interview_node(self, state: InterviewState) -> InterviewState:
        """Initialize the interview session"""
        session = InterviewSession.objects.get(id=state["session_id"])
        
        print(f"\n🎯 Starting Interview Session")
        print(f"Candidate: {session.Application.user.username}")
        print(f"Position: {session.Application.interview.post}")
        print(f"Organization: {session.Application.interview.org.orgname}")
        print(f"Duration: {session.Application.interview.duration} minutes")
        print(f"AI Model: {self.config.llm_model}")
        print("=" * 60)
        
        # Build initial conversation context
        context = f"""
        Interview for: {session.Application.interview.post}
        Organization: {session.Application.interview.org.orgname}
        Required Experience: {session.Application.interview.experience}
        Candidate: {session.Application.user.username}
        """
        
        state["conversation_context"] = context
        state["questions_asked"] = 0
        state["followup_count"] = 0
        state["max_followups"] = self.config.max_followups
        state["interview_completed"] = False
        state["evaluation_result"] = None  # Initialize evaluation_result
        
        return state
    
    def ask_question_node(self, state: InterviewState) -> InterviewState:
        """Ask the next question in the interview"""
        session = InterviewSession.objects.get(id=state["session_id"])
        
        # Get next question from the interview template
        questions = Customquestion.objects.filter(
            interview=session.Application.interview
        ).order_by('id')
        
        if state["questions_asked"] >= len(questions):
            state["interview_completed"] = True
            return state
        
        current_question = questions[state["questions_asked"]]
        state["main_question"] = current_question.question
        state["expected_answer"] = current_question.answer
        # Create new interaction
        interaction = Interaction.objects.create(
            session=session,
            Customquestion=current_question
        )
        
        state["current_question"] = current_question.question
        state["current_interaction"] = interaction.id
        state["followup_count"] = 0
        
        print(f"\n📋 Question {state['questions_asked'] + 1}:")
        print(f"{current_question.question}")
        print("-" * 40)
        
        return state
    
    def get_answer_node(self, state: InterviewState) -> InterviewState:
        """Get candidate's answer via CLI input"""
        print("\n💬 Your answer (Press Enter twice to submit):")
        lines = []
        empty_line_count = 0
        
        while empty_line_count < 2:
            line = input()
            if line == "":
                empty_line_count += 1
            else:
                empty_line_count = 0
            lines.append(line)
        
        # Remove trailing empty lines
        while lines and lines[-1] == "":
            lines.pop()
        
        answer = "\n".join(lines)
        state["current_answer"] = answer
        
        # Add to message history
        state["messages"].append(
            HumanMessage(content=f"Q: {state['current_question']}\nA: {answer}")
        )
        
        return state
    def follow_up_decider_node(self, req: FollowUpRequest) -> FollowUpDecision:
        """Decide whether a follow-up question is needed based on the candidate's answer"""
        
        print("\n🤖 Evaluating your answer using Groq AI...")
        
        # Create fallback result
        fallback_result = FollowUpDecision(
            needs_followup=False,
            followup_question=None
        )
        
        try:
            # Prepare evaluation prompt
            follow_up_chain = self.follow_up_decider | self.llm | self.FollowUpParser

            result = follow_up_chain.invoke({
                "position": req.position,
                "experience": req.experience,
                "conversation_context": req.conversation_context,
                "format_instructions": self.FollowUpParser.get_format_instructions(),
                "expected_answer": req.expected_answer,
            })

            # Ensure result is FollowUpDecision object
            if isinstance(result, dict):
                result = FollowUpDecision(**result)
            
        except Exception as e:
            print(f"Error during follow up decision: {e}")
            print("Using fallback decision...")

            # Display fallback results
            print(f"\n📊 Fallback Follow Up Decision Results:")
            print(f"Needs Follow Up: {fallback_result.needs_followup}")
            print(f"Follow Up Question: {fallback_result.followup_question}")
        
        return FollowUpDecision(
            needs_followup=result.needs_followup if hasattr(result, 'needs_followup') else fallback_result.needs_followup,
            followup_question=result.followup_question if hasattr(result, 'followup_question') else fallback_result.followup_question
        )
    def evaluate_answer(self, req: EvaluationRequest) -> EvaluationResult:
        """Evaluate the candidate's answer using Groq LLM"""
        
        print("\n🤖 Evaluating your answer using Groq AI...")
        
        # Create fallback result
        fallback_result = EvaluationResult(
            score=5,
            feedback="Could not evaluate automatically due to technical error",
            reasoning="Technical error occurred during AI evaluation"
        )
        
        try:
            # Prepare evaluation prompt
            evaluation_chain = self.evaluation_prompt | self.llm | self.EvaluationParser

            result = evaluation_chain.invoke({
                "position": req.position,
                "experience": req.experience,
                "conversation_context": req.conversation_context,
                "question": req.question,
                "format_instructions": self.EvaluationParser.get_format_instructions(),
                "expected_answer": req.expected_answer,
            })
            
            # Ensure result is EvaluationResult object
            if isinstance(result, dict):
                result = EvaluationResult(**result)
            
            # Clean up any truncated text in the response
            if hasattr(result, 'feedback') and result.feedback:
                result.feedback = result.feedback.replace('<|header_start|>', '').replace('<|end|>', '').strip()
            
            if hasattr(result, 'reasoning') and result.reasoning:
                result.reasoning = result.reasoning.replace('<|header_start|>', '').replace('<|end|>', '').strip()
            
            # Validate the result has required fields
            if not hasattr(result, 'score') or not hasattr(result, 'feedback') or not hasattr(result, 'reasoning'):
                raise ValueError("Missing required fields in evaluation result")
            
            if not result.feedback or not result.reasoning:
                raise ValueError("Empty feedback or reasoning in evaluation result")
            
            # Ensure score is within valid range
            if not isinstance(result.score, int) or result.score < 0 or result.score > 10:
                print(f"Warning: Invalid score {result.score}, using fallback")
                result.score = 5
            
            # Display feedback with proper formatting
            print(f"\n📊 Evaluation Results:")
            print(f"Score: {result.score}/10")
            print(f"Feedback: {result.feedback}")
            print(f"Reasoning: {result.reasoning}")
            
        except Exception as e:
            print(f"Error during evaluation: {e}")
            print("Using fallback evaluation...")
            
            
            # Display fallback results
            print(f"\n📊 Fallback Evaluation Results:")
            print(f"Score: {fallback_result.score}/10")
            print(f"Feedback: {fallback_result.feedback}")
            print(f"Reasoning: {fallback_result.reasoning}")
        
        return EvaluationResult(
            score=result.score if hasattr(result, 'score') else fallback_result.score,
            feedback=result.feedback if hasattr(result, 'feedback') else fallback_result.feedback,
            reasoning=result.reasoning if hasattr(result, 'reasoning') else fallback_result.reasoning
        )
    def decide_followup_node(self, state: InterviewState) -> InterviewState:
        """Decide whether to ask follow-up questions"""
        # Check if evaluation_result exists and is not None
        if state.get("evaluation_result") is None:
            print("Warning: No evaluation result found, skipping follow-up")
            state["needs_followup"] = False
            return state
            
        result = state["evaluation_result"]
        
        # Decision logic for follow-ups
        should_followup = (
            result.needs_followup and 
            state["followup_count"] < state["max_followups"] and
            result.followup_question is not None and
            result.followup_question.strip() != ""
        )
        
        state["needs_followup"] = should_followup
        
        if should_followup:
            print(f"\n🔄 Follow-up question needed (#{state['followup_count'] + 1}):")
        
        return state
    
    def ask_followup_node(self, state: InterviewState) -> InterviewState:
        """Ask a follow-up question"""
        # Check if evaluation_result exists and is not None
        if state.get("evaluation_result") is None:
            print("Error: No evaluation result for follow-up question")
            state["needs_followup"] = False
            return state
            
        result = state["evaluation_result"]
        
        # Check if follow-up question exists
        if not result.followup_question:
            print("Error: No follow-up question available")
            state["needs_followup"] = False
            return state
        
        # Create follow-up question record
        try:
            interaction = Interaction.objects.get(id=state["current_interaction"])
            followup = FollowUpQuestions.objects.create(
                Interaction=interaction,
                question=result.followup_question
            )
            
            state["current_question"] = result.followup_question
            state["followup_count"] += 1
            
            print(f"\n🔍 Follow-up: {result.followup_question}")
            print("-" * 40)
            
        except Exception as e:
            print(f"Error creating follow-up question: {e}")
            state["needs_followup"] = False
        
        return state
    
    def next_question_node(self, state: InterviewState) -> InterviewState:
        """Move to the next question"""
        state["questions_asked"] += 1
        
        # Reset evaluation result for next question
        state["evaluation_result"] = None
        
        # Update conversation context
        context_chain = self.context_prompt | self.llm
        
        try:
            conversation_summary = context_chain.invoke({
                "conversation_history": "\n".join([msg.content for msg in state["messages"]])
            })
            
            # Handle both string and AIMessage responses
            if hasattr(conversation_summary, 'content'):
                summary_text = conversation_summary.content
            else:
                summary_text = str(conversation_summary)
            
            state["conversation_context"] += f"\n\nRecent Discussion:\n{summary_text}"
        except Exception as e:
            print(f"Warning: Could not update context: {e}")
        
        return state
    
    def conclude_interview_node(self, state: InterviewState) -> InterviewState:
        """Conclude the interview session"""
        session = InterviewSession.objects.get(id=state["session_id"])
        
        # Calculate overall score
        interactions = Interaction.objects.filter(session=session)
        total_score = sum(i.score or 0 for i in interactions)
        avg_score = total_score / len(interactions) if interactions else 0
        
        # Update session
        session.end_time = datetime.now(timezone.utc)
        session.status = 'completed'
        session.score = avg_score
        session.save()
        
        print(f"\n✅ Interview Completed!")
        print(f"Overall Score: {avg_score:.2f}/10")
        print(f"Questions Asked: {state['questions_asked']}")
        print(f"AI Model Used: {self.config.llm_model}")
        print(f"Thank you for your time!")
        
        state["interview_completed"] = True
        
        return state
    
    def should_ask_followup(self, state: InterviewState) -> str:
        """Conditional edge function"""
        if state["interview_completed"]:
            return "end"
        elif state.get("needs_followup", True) and state["followup_count"] < state["max_followups"]:
            return "followup"
        else:
            return "next"
    
    def run_interview(self, session_id: int):
        """Main method to run the interview"""
        initial_state = InterviewState(
            messages=[],
            current_question=None,
            current_answer=None,
            session_id=session_id,
            current_interaction=None,
            questions_asked=0,
            followup_count=0,
            max_followups=self.config.max_followups,
            interview_completed=False,
            conversation_context="",
            evaluation_result=None  # Initialize with None
        )
        
        try:
            # Run the graph
            for state in self.graph.stream(initial_state):
                # State updates are handled by the nodes
                pass
        except KeyboardInterrupt:
            print("\n\n⚠️  Interview interrupted by user")
            self.handle_interruption(session_id)
        except Exception as e:
            print(f"\n❌ Error during interview: {e}")
            self.handle_error(session_id, str(e))
    
    def handle_interruption(self, session_id: int):
        """Handle interview interruption"""
        session = InterviewSession.objects.get(id=session_id)
        session.status = 'cancelled'
        session.end_time = datetime.now(timezone.utc)
        session.save()
    
    def handle_error(self, session_id: int, error_msg: str):
        """Handle interview errors"""
        session = InterviewSession.objects.get(id=session_id)
        session.status = 'cancelled'
        session.feedback = f"Error: {error_msg}"
        session.end_time = datetime.now(timezone.utc)
        session.save()

