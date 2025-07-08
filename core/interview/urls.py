from django.urls import path
from . import views

urlpatterns = [
    path('create-interview/', views.CustomInterviewCreateView.as_view(), name='create_interview'),
]