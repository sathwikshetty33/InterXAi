from django.shortcuts import render
from .serializers import CustomInterviewSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from .permissions import *
from .agent import *
# Create your views here.
class CustomInterviewCreateView(APIView):
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
                session.status = 'completed'
                session.save()
                return Response({
                    "message": "Interview completed successfully.", 
                    "feedback": interaction.feedback,
                    "final_score": interaction.score
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
                        "is_followup": True
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
                        session.status = 'completed'
                        session.save()
                        return Response({
                            "message": "Interview completed successfully.",
                            "feedback": interaction.feedback,
                            "final_score": interaction.score
                        }, status=status.HTTP_200_OK)
                        
            except Exception as e:
                return Response({"error": f"Follow-up decision failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)