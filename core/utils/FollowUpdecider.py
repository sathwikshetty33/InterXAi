import os
import django
from langchain_core.output_parsers import JsonOutputParser
from .request_models import *
from .prompts import *
from .config import InterviewConfig
from .BaseAgent import InterviewManager
# Django setup
# sys.path.append('/home/sathwik/InterXAI-v2/')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

class FollowUpDecider(InterviewManager):
    """Class to decide check whether to find follow up or not"""
    
    def __init__(self, config: InterviewConfig = None):
        super().__init__(
            config=config,
            prompt=follow_up_decider,
            output_parser=JsonOutputParser(pydantic_object=FollowUpDecision)
        )
    def evaluate(self, req: FollowUpRequest) -> FollowUpDecision:
        """Decide whether a follow-up question is needed based on the candidate's answer"""        
        # Create fallback result
        fallback_result = FollowUpDecision(
            needs_followup=False,
            followup_question=None
        )
        
        try:
            follow_up_chain = self.prompt | self.llm | self.output_parser

            result = follow_up_chain.invoke({
                "position": req.position,
                "experience": req.experience,
                "conversation_context": req.conversation_context,
                "format_instructions": self.output_parser.get_format_instructions(),
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
