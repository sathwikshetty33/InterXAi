from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from .permissions import *
from utils.agent import *
from django.utils import timezone

# Create your views here.
class CustomInterviewView(APIView):
    permission_classes = [IsAuthenticated, IsOrganization]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        serializer = CustomInterviewSerializer(data=request.data)
        if serializer.is_valid():
            # Get the first organization associated with the user
            org_instance = request.user.organization.first()
            
            serializer.save(org=org_instance)
            return Response({"message": "Interview created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, id):
        try:
            interview = Custominterviews.objects.get(id=id)
        except Custominterviews.DoesNotExist:
            return Response({"error": "Interview not found."}, status=status.HTTP_404_NOT_FOUND)
        if interview.org.org != request.user:
            return Response({"error": "You do not have permission to update this interview."}, status=status.HTTP_403_FORBIDDEN)
        serializer = CustomInterviewSerializer(interview, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Interview updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        interviews = Custominterviews.objects.filter(org__org=request.user)
        serializer = CustomInterviewSerializer(interviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request, id):
        try:
            interview = Custominterviews.objects.get(id=id)
        except Custominterviews.DoesNotExist:
            return Response({"error": "Interview not found."}, status=status.HTTP_404_NOT_FOUND)
        if interview.org.org != request.user:
            return Response({"error": "You do not have permission to view this interview."}, status=status.HTTP_403_FORBIDDEN)
        serializer = CustomInterviewSerializer(interview)
        return Response(serializer.data, status=status.HTTP_200_OK)
class InterviewSessionInitializerView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, interview_id):
        try:
            interview = Application.objects.get(id=interview_id)
        except Application.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        if not interview.approved:
            return Response({"error": "Application not approved."}, status=status.HTTP_403_FORBIDDEN)
        if interview.status !=  'scheduled':
            return Response({"error": "Interview session already exists or is not scheduled."}, status=status.HTTP_400_BAD_REQUEST)
        if interview.user != request.user:
            return Response({"error": "You do not have permission to initialize this interview session."}, status=status.HTTP_403_FORBIDDEN)
        session = InterviewSession.objects.create(Application=interview)
        question = Customquestion.objects.filter(interview=interview.interview).first()
        if question:
            session.current_question_index = 0
            interaction = Interaction.objects.create(session=session, question=question.question)
            follow_up = FollowUpQuestions.objects.create(Interaction=interaction, question=question.question)
        return Response({"message": "Interview session initialized successfully.", "session_id": session.id, "question": question.question}, status=status.HTTP_201_CREATED)

class InterviewSessionView(APIView):
    permission_classes = [IsAuthenticated]  # Adjust as needed, e.g., IsAuthenticated
    authentication_classes = [TokenAuthentication]

    def post(self, request, id):
        try:
            session = InterviewSession.objects.get(id=id)
        except InterviewSession.DoesNotExist:
            return Response({"error": "Interview session not found."}, status=status.HTTP_404_NOT_FOUND)
        
        current_index = session.current_question_index
        questions = Customquestion.objects.filter(interview=session.Application.interview)
        current_question = questions[current_index] if current_index < len(questions) else None
        
        if not current_question:
            return Response({"error": "No current question found."}, status=status.HTTP_400_BAD_REQUEST)
        
        interaction = Interaction.objects.filter(session=session, Customquestion=current_question).first()
        
        if not interaction:
            # Create new interaction if it doesn't exist
            interaction = Interaction.objects.create(
                session=session,
                Customquestion=current_question
            )
        follow_up = FollowUpQuestions.objects.filter(Interaction=interaction).last()
        follow_up.answer = request.query_params.get('answer', None)
        follow_up.save()
        
        # Build conversation context from follow-up questions
        follow_up_questions = FollowUpQuestions.objects.filter(Interaction=interaction).order_by('created_at')
        conversation_context = []
        for follow_up in follow_up_questions:
            conversation_context.append(f"Q: {follow_up.question}")
            if follow_up.answer:
                conversation_context.append(f"A: {follow_up.answer}")
        
        count = follow_up_questions.count()
        llm = InterviewManager()
        
        if count >= 3:
            # Use the evaluate_answer method from InterviewManager
            req = EvaluationRequest(
                position=session.Application.interview.post,
                experience=session.Application.interview.experience,
                question=current_question.question,
                conversation_context=conversation_context,
                expected_answer=current_question.answer
            )
            
            try:
                response = llm.evaluate_answer(req)
                interaction.score = response.score
                interaction.feedback = response.feedback
                interaction.save()
            except Exception as e:
                return Response({"error": f"Evaluation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            session.current_question_index += 1
            session.save()
            
            if questions.count() > session.current_question_index:
                next_question = questions[session.current_question_index].question
                next_interaction = Interaction.objects.create(
                    session=session,
                    Customquestion=questions[session.current_question_index]
                )
                follow_up = FollowUpQuestions.objects.create(
                    Interaction=next_interaction, 
                    question=next_question
                )
                return Response({
                    "session_id": session.id, 
                    "current_question": next_question,
                    "feedback": response.feedback,
                    "score": response.score
                }, status=status.HTTP_200_OK)
            else:
                # Interview completed - perform final evaluation
                session.status = 'completed'
                session.save()
                
                # Perform final evaluation
                final_evaluation_response = self.perform_final_evaluation(session)
                
                return Response({
                    "message": "Interview completed successfully.", 
                    "feedback": interaction.feedback,
                    "final_score": interaction.score,
                    "overall_evaluation": final_evaluation_response
                }, status=status.HTTP_200_OK)
        else:
            # Use the follow_up_decider method from InterviewManager
            req = FollowUpRequest(
                position=session.Application.interview.post,
                experience=session.Application.interview.experience,
                expected_answer=current_question.answer,
                conversation_context=conversation_context
            )
            
            try:
                follow_up_decision = llm.follow_up_decider_node(req)
                
                if follow_up_decision.needs_followup and follow_up_decision.followup_question:
                    # Create follow-up question
                    next_question_obj = FollowUpQuestions.objects.create(
                        Interaction=interaction, 
                        question=follow_up_decision.followup_question
                    )
                    return Response({
                        "session_id": session.id, 
                        "current_question": follow_up_decision.followup_question,
                        "feedback": "Follow-up needed.",
                        "score": 5
                    }, status=status.HTTP_200_OK)
                else:
                    # No follow-up needed - evaluate the current interaction
                    eval_req = EvaluationRequest(
                        position=session.Application.interview.post,
                        experience=session.Application.interview.experience,
                        question=current_question.question,
                        conversation_context=conversation_context,
                        expected_answer=current_question.answer
                    )
                    
                    try:
                        evaluation_response = llm.evaluate_answer(eval_req)
                        interaction.score = evaluation_response.score
                        interaction.feedback = evaluation_response.feedback
                        interaction.save()
                    except Exception as e:
                        return Response({"error": f"Evaluation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
                    session.current_question_index += 1
                    session.save()
                    
                    if questions.count() > session.current_question_index:
                        next_question = questions[session.current_question_index].question
                        next_interaction = Interaction.objects.create(
                            session=session,
                            Customquestion=questions[session.current_question_index]
                        )
                        next_question_obj = FollowUpQuestions.objects.create(
                            Interaction=next_interaction, 
                            question=next_question
                        )
                        return Response({
                            "session_id": session.id, 
                            "current_question": next_question,
                            "is_followup": False,
                            "feedback": evaluation_response.feedback,
                            "score": evaluation_response.score
                        }, status=status.HTTP_200_OK)
                    else:
                        # Interview completed - perform final evaluation
                        session.status = 'completed'
                        session.save()
                        
                        final_evaluation_response = self.perform_final_evaluation(session)
                        
                        return Response({
                            "message": "Interview completed successfully.",
                            "feedback": interaction.feedback,
                            "final_score": interaction.score,
                            "overall_evaluation": final_evaluation_response
                        }, status=status.HTTP_200_OK)
                        
            except Exception as e:
                return Response({"error": f"Follow-up decision failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def perform_final_evaluation(self, session):
        """
        Performs final evaluation of the completed interview session
        """
        try:
            # Get all interactions for this session
            interactions = Interaction.objects.filter(session=session).order_by('created_at')
            
            if not interactions.exists():
                return {"error": "No interactions found for final evaluation"}
            
            # Build comprehensive interview history
            interview_history = []
            
            for interaction in interactions:
                question_data = {
                    "main_question": interaction.Customquestion.question,
                    "expected_answer": interaction.Customquestion.answer,
                    "conversation": [],
                    "individual_score": interaction.score,
                    "individual_feedback": interaction.feedback
                }
                
                # Get all follow-up questions and answers for this interaction
                follow_ups = FollowUpQuestions.objects.filter(
                    Interaction=interaction
                ).order_by('created_at')
                
                for follow_up in follow_ups:
                    question_data["conversation"].append({
                        "question": follow_up.question,
                        "answer": follow_up.answer if follow_up.answer else "No answer provided"
                    })
                
                interview_history.append(question_data)
            
            llm = InterviewManager()
            
            req = FinalEvaluationRequest(
                position=session.Application.interview.post,
                experience=session.Application.interview.experience,
                interview_history=interview_history
            )
            
            final_evaluation = llm.final_evaluate_interview(req)
            
            # Save final evaluation to session
            session.score = final_evaluation.overall_score
            session.feedback = final_evaluation.overall_feedback
            session.strengths = final_evaluation.strengths
            session.recommendation = final_evaluation.recommendation
            session.save()
            
            return {
                "overall_score": final_evaluation.overall_score,
                "overall_feedback": final_evaluation.overall_feedback,
                "strengths": final_evaluation.strengths,
                "recommendation": final_evaluation.recommendation,
                "individual_scores": [
                    {
                        "question": interaction.Customquestion.question,
                        "score": interaction.score,
                        "feedback": interaction.feedback
                    } for interaction in interactions
                ]
            }
            
        except Exception as e:
            return {"error": f"Final evaluation failed: {str(e)}"}

class GetAllInterviewsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        interviews = Custominterviews.objects.filter(submissionDeadline__gt=timezone.now())
        serializer = InterviewSerializer(interviews, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, id):
        try:
            interview = Custominterviews.objects.get(id=id)
        except Custominterviews.DoesNotExist:
            return Response({"error": "Interview not found."}, status=status.HTTP_404_NOT_FOUND)
        if Application.objects.filter(user=request.user, interview=interview).exists():
            return Response({"error": "You have already applied for this interview."}, status=status.HTTP_400_BAD_REQUEST)
        if interview.submissionDeadline < timezone.now():
            return Response({"error": "Submission deadline has passed."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ApplyApplicationSerializer(data=request.data)

        if serializer.is_valid():
            application = serializer.save(user=request.user, interview=interview)
            return Response({"message": "Application created successfully.", "application_id": application.id}, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
