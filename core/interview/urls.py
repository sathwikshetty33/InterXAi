from django.urls import path
from . import views

urlpatterns = [
    path('create-interview/', views.CustomInterviewCreateView.as_view(), name='create_interview'),
    path('interview-session/<int:id>/', views.InterviewSessionView.as_view(), name='initialize_interview_session'),
]