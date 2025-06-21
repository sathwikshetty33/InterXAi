from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login, authenticate, logout
from django.utils import timezone
from datetime import datetime, timezone
# from .forms import *
from rest_framework.authtoken.models import Token
from .utils import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from organization.models import *
from .serializers import *  
import json
from users.models import *
@method_decorator(csrf_exempt, name='dispatch')
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Check if username already exists
            if User.objects.filter(username=username).exists():
                return Response({
                    'success': False,
                    'error': 'Username already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Store user data in session
            user_data = {
                'username': username,
                'email': email,
                'password': password,
            }
            request.session['pending_user'] = user_data
            
            # Generate and store verification code
            code = generate_verification_code()
            request.session['verification_code'] = code
            request.session['code_generated_at'] = datetime.now(timezone.utc).timestamp()
            
            # Send verification email
            send_verification_email(email, code)
            
            return Response({
                'success': True,
                'message': 'Verification code sent to your email'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Check if we have pending registration
        pending_user = request.session.get('pending_user')
        if not pending_user:
            return Response({
                'success': False,
                'error': 'No pending registration found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = VerificationCodeSerializer(data=request.data)
        if serializer.is_valid():
            submitted_code = serializer.validated_data['verification_code']
            stored_code = request.session.get('verification_code')
            code_generated_at = request.session.get('code_generated_at')
            
            current_time = datetime.now(timezone.utc).timestamp()
            is_expired = (current_time - code_generated_at) > 30
            
            if stored_code and submitted_code == stored_code and not is_expired:
                try:
                    # Create the user
                    user = User.objects.create_user(
                        username=pending_user['username'],
                        email=pending_user['email'],
                        password=pending_user['password']
                    )
                    
                    # Clean up session
                    for key in ['pending_user', 'verification_code', 'code_generated_at']:
                        if key in request.session:
                            del request.session[key]
                    
                    # Authenticate and login the user
                    authenticated_user = authenticate(
                        request,
                        username=pending_user['username'],
                        password=pending_user['password']
                    )
                    
                    if authenticated_user is not None:
                        login(request, authenticated_user, backend='django.contrib.auth.backends.ModelBackend')
                        return Response({
                            'success': True,
                            'message': 'User registered and logged in successfully',
                            'user_id': user.id,
                            'username': user.username
                        }, status=status.HTTP_201_CREATED)
                    else:
                        return Response({
                            'success': False,
                            'error': 'Authentication failed'
                        }, status=status.HTTP_400_BAD_REQUEST)
                        
                except Exception as e:
                    return Response({
                        'success': False,
                        'error': str(e)
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                error = 'Code expired' if is_expired else 'Invalid code'
                return Response({
                    'success': False,
                    'error': error
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class ResendCodeAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        pending_user = request.session.get('pending_user')
        if not pending_user:
            return Response({
                'success': False,
                'error': 'No pending registration'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Generate new code
            code = generate_verification_code()
            request.session['verification_code'] = code
            request.session['code_generated_at'] = datetime.now(timezone.utc).timestamp()
            send_verification_email(pending_user['email'], code)
            
            return Response({
                'success': True,
                'message': 'Verification code resent'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# @method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                # Get or create token for the user
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'token': token.key,
                    'user_id': user.id,
                    'username': user.username,
                    'email': user.email
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({
            'success': True,
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            
            try:
                user = User.objects.get(username=username)
                email = user.email
                reset_code = generate_verification_code()
                
                request.session['reset_code'] = reset_code
                request.session['reset_email'] = email
                request.session['username'] = username
                request.session['code_generated_at'] = datetime.now(timezone.utc).timestamp()
                
                send_reset_code_email(email, reset_code)
                
                return Response({
                    'success': True,
                    'message': 'Reset code sent to your email'
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'No account found with this username'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class VerifyResetCodeAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        reset_email = request.session.get('reset_email')
        if not reset_email:
            return Response({
                'success': False,
                'error': 'No pending reset request'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = VerificationCodeSerializer(data=request.data)
        if serializer.is_valid():
            submitted_code = serializer.validated_data['verification_code']
            stored_code = request.session.get('reset_code')
            code_generated_at = request.session.get('code_generated_at')
            
            # Check if code is expired (30 seconds)
            current_time = datetime.now(timezone.utc).timestamp()
            is_expired = (current_time - code_generated_at) > 30
            
            if stored_code and submitted_code == stored_code and not is_expired:
                request.session['reset_verified'] = True
                return Response({
                    'success': True,
                    'message': 'Code verified successfully'
                }, status=status.HTTP_200_OK)
            else:
                error = 'Code expired' if is_expired else 'Invalid code'
                return Response({
                    'success': False,
                    'error': error
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class ResendResetCodeAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        reset_email = request.session.get('reset_email')
        if not reset_email:
            return Response({
                'success': False,
                'error': 'No pending reset request'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Generate new code
            reset_code = generate_verification_code()
            request.session['reset_code'] = reset_code
            request.session['code_generated_at'] = datetime.now(timezone.utc).timestamp()
            
            # Send new code
            send_reset_code_email(reset_email, reset_code)
            
            return Response({
                'success': True,
                'message': 'Reset code resent'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        if not request.session.get('reset_verified'):
            return Response({
                'success': False,
                'error': 'Reset code not verified'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            password1 = serializer.validated_data['password1']
            password2 = serializer.validated_data['password2']
            
            if password1 != password2:
                return Response({
                    'success': False,
                    'error': 'Passwords do not match'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(password1) < 8:
                return Response({
                    'success': False,
                    'error': 'Password must be at least 8 characters long'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.get(username=request.session['username'])
                user.set_password(password1)
                user.save()
                
                # Clean up session
                for key in ['reset_email', 'reset_code', 'code_generated_at', 'reset_verified', 'username']:
                    if key in request.session:
                        del request.session[key]
                
                return Response({
                    'success': True,
                    'message': 'Password reset successful'
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class EditProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response({
            'success': True,
            'profile': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            profile = serializer.save()
            profile.user = request.user
            
            # Handle file upload
            if 'photo' in request.FILES:
                profile.photo = request.FILES['photo']
                profile.save()
            
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'profile': UserProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)