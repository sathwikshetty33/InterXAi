from django.shortcuts import render
from .serializers import CustomInterviewSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .permissions import *
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