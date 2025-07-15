from django.urls import path
from . import views

urlpatterns = [
    path('create-interview/', views.CustomInterviewView.as_view(), name='create_interview'),
    path('interview-session/<int:id>/', views.InterviewSessionView.as_view(), name='initialize_interview_session'),
    path('edit-interview/<int:id>/', views.CustomInterviewView.as_view(), name='edit_interview'),
    path('get-interviews/', views.getInterview.as_view(), name='get_interview'),
    path('get-interview/<int:id>/', views.CustomInterviewView.as_view(), name='get_interview_by_id'),
    path('get-all-interviews/', views.GetAllInterviewsView.as_view(), name='get_all_interviews'),
    path('apply-interview/<int:id>/', views.ApplicationView.as_view(), name='apply_interview'),
    path('interview-session-initializer/<int:id>/', views.InterviewSessionInitializerView.as_view(), name='interview_session_initializer'),

]