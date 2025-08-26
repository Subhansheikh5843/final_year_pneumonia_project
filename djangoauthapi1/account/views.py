import json
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import (
  UserLoginSerializer,
  UserRegistrationSerializer,
  UserPasswordResetSerializer,
  UserChangePasswordSerializer,
  UserSerializer,
  SendPasswordResetEmailSerializer
)
from django.contrib.auth import authenticate
from account.renderers import userRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated



def get_tokens_for_user(user):
    """
    Generate refresh and access JWT tokens for a given user.

    Args:
        user (User): The user instance for whom the tokens are being generated.

    Returns:
        dict: A dictionary containing the refresh and access tokens as strings.
              {
                  'refresh': '<refresh_token>',
                  'access': '<access_token>'
              }
    """
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
    
class UserRegisterationView(APIView):
  """
    API view to handle user registration.
  """
  renderer_classes = [userRenderer]
  
  def post(self,request,format=None):
    """
        Handle POST request to register a new user.

        Validates incoming user data using UserRegistrationSerializer.
        On successful registration, generates JWT tokens for the user
        and returns both the token and serialized user data.

        Args:
            request (Request): The HTTP request containing user registration data.
            format (str, optional): The format suffix (if any).

        Returns:
            Response: 
                - 201 Created with token and user data on success.
                - 400 Bad Request with serializer errors on failure.
      """
      
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      user = serializer.save()
      token = get_tokens_for_user(user)
      user_data = UserSerializer(user).data  
      
      return Response({'token':token,'user': user_data }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
  """
    API view to handle user login.

  """
  renderer_classes = [userRenderer]
  
  def post(self,request,format=None):
    """
        Handle POST request for user login.

        Args:
            request (Request): HTTP request with login credentials.
            format (str, optional): Optional format specifier.

        Returns:
            Response:
                - 200 OK with token and user data on success.
                - 404 Not Found if credentials are invalid.
                - 400 Bad Request if serializer validation fails.
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      email = serializer.data.get('email')
      password = serializer.data.get('password')
      user = authenticate(email=email,password=password)
      if user is not None:
          token = get_tokens_for_user(user)
          user_data = UserSerializer(user).data
          return Response({'token':token,'user': user_data}, status=status.HTTP_200_OK)
        
      else:
        return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}},status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserChangePasswordView(APIView):
  """
    API view to allow authenticated users to change their password.
  """
  renderer_classes = [userRenderer]
  permission_classes = [IsAuthenticated]
  
  def post(self,request,format=None):
    """
        Handle POST request to change password.

        Args:
            request (Request): HTTP request with old and new passwords.
            format (str, optional): Optional format specifier.

        Returns:
            Response:
                - 200 OK if password is changed successfully.
                - 400 Bad Request if validation fails.
    """
    serializer = UserChangePasswordSerializer(data=request.data,context = {'user':request.user})
    if serializer.is_valid(raise_exception=True):
          return Response({"msg":"password Changed Successfully"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  
class SendPasswordResetEmailView(APIView):
  """
    API view to send a password reset link to the user's email.
  """
  renderer_classes = [userRenderer]
  
  def post(self,request,format=None):
    """
        Handle POST request to initiate password reset process.

        Args:
            request (Request): HTTP request with user's email.
            format (str, optional): Optional format specifier.

        Returns:
            Response:
                - 200 OK if reset email is sent.
                - 400 Bad Request if validation fails.
    """
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
          return Response({"msg":"password Reset Link send. Please check your Email"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
  
class UserPasswordResetView(APIView):
  """
    API view to reset user's password using uid and token.
  """
  renderer_classes = [userRenderer]
  
  def post(self,request,uid,token,format=None):
    """
        Handle POST request to reset the password.

        Args:
            request (Request): HTTP request with new password.
            uid (str): Encoded user ID from the reset link.
            token (str): Password reset token.
            format (str, optional): Optional format specifier.

        Returns:
            Response:
                - 200 OK if password is reset successfully.
                - 400 Bad Request if validation fails.
    """
    serializer = UserPasswordResetSerializer(data=request.data,context={'uid':uid,'token':token})
    if serializer.is_valid(raise_exception=True):
          return Response({"msg":"password Reset Successfully"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




