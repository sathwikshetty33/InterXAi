from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterAPIView.as_view(), name='api_register'),
    path('verify-email/', views.VerifyEmailAPIView.as_view(), name='api_verify_email'),
    path('resend-code/', views.ResendCodeAPIView.as_view(), name='api_resend_code'),
    path('login/', views.LoginAPIView.as_view(), name='api_login'),
    path('logout/', views.LogoutAPIView.as_view(), name='api_logout'),
    path('forgot-password/', views.ForgotPasswordAPIView.as_view(), name='api_forgot_password'),
    path('verify-reset-code/', views.VerifyResetCodeAPIView.as_view(), name='api_verify_reset_code'),
    path('resend-reset-code/', views.ResendResetCodeAPIView.as_view(), name='api_resend_reset_code'),
    path('reset-password/', views.ResetPasswordAPIView.as_view(), name='api_reset_password'),
    path('profile/', views.EditProfileAPIView.as_view(), name='api_edit_profile'),
]