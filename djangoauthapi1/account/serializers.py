from rest_framework import serializers
from account.models import User 
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from account.utils import Util


class UserRegistrationSerializer(serializers.ModelSerializer):
  """
    Serializer for registering a new user.

    Includes validation for matching passwords and creates a new user using
    the custom user model's `create_user` method.
  """
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  class Meta:
    model = User
    fields=['email', 'name', 'password', 'password2']
    extra_kwargs={
      'password':{'write_only':True}
    }

  def validate(self, attrs):
    """
        Ensure both password and password2 match.

        Args:
            attrs (dict): Validated data.

        Returns:
            dict: Validated data if passwords match.

        Raises:
            ValidationError: If passwords don't match.
    """
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    return attrs

  def create(self, validate_data):
    """
        Create a new user.

        Args:
            validate_data (dict): Validated user data.

        Returns:
            User: The created user instance.
    """
    return User.objects.create_user(**validate_data)
  
  
class UserLoginSerializer(serializers.ModelSerializer):
  """
    Serializer for user login.

    Validates email and password for authentication.
  """
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User 
    fields = ['email','password']
    
    
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for returning user profile data.
    """
    class Meta:
        model = User  
        fields = ['id', 'email', 'name']
    

class UserChangePasswordSerializer(serializers.Serializer):
  """
    Serializer for changing the user's password.

    Ensures new password and confirmation password match,
    and updates the user instance's password.
  """
  password = serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
  password2 = serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
  class Meta:
    fields = ['password','pasword2']
  
  def validate(self,attrs):
    """
        Validate and change the user's password.

        Args:
            attrs (dict): Data containing new password and confirmation.

        Returns:
            dict: Validated data.

        Raises:
            ValidationError: If passwords don't match.
    """
    password = attrs.get('password')
    password2 = attrs.get('password2')
    user = self.context.get('user')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    user.set_password(password)
    user.save()
    return attrs
  
  
class SendPasswordResetEmailSerializer(serializers.Serializer):
  """
    Serializer to handle sending a password reset email to the user.

    Validates if the email exists in the system, then sends an email
    with a password reset link containing a UID and token.
  """
  email = serializers.EmailField(max_length=255)
  class Meta:
    fields = ['email']
    
  def validate(self,attrs):
    """
        Validate user email and send password reset link.

        Args:
            attrs (dict): Contains the email field.

        Returns:
            dict: The original validated data.

        Raises:
            ValidationError: If the user with the given email is not found.
    """
    email = attrs.get('email')
    if User.objects.filter(email=email).exists():
      user = User.objects.get(email=email)
      uid = urlsafe_base64_encode(force_bytes(user.id))
      token = PasswordResetTokenGenerator().make_token(user)
      link = 'http://localhost:3000/api/user/reset/'+uid+'/'+token 
      body = 'Click Following Link to reset Your Password '+link
      data = {
        'subject':'Reset Your Password',
        'body':body,
        'to_email':user.email
      }
      Util.send_email(data)
      return attrs
    else:
      raise serializers.ValidationError('You are not registered User')
    
    
class UserPasswordResetSerializer(serializers.Serializer):
  """
    Serializer to handle the actual password reset using the UID and token
    from the password reset email.

    Validates that both password fields match and that the token is valid.
  """
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

  def validate(self, attrs):
    """
        Validates that the token is valid and the passwords match,
        then resets the user's password.

        Args:
            attrs (dict): Contains the password and password2 fields.

        Returns:
            dict: The validated data.

        Raises:
            ValidationError: If passwords don't match or token is invalid/expired.
    """
    try:
      password = attrs.get('password')
      password2 = attrs.get('password2')
      uid = self.context.get('uid')
      token = self.context.get('token')
      if password != password2:
        raise serializers.ValidationError("Password and Confirm Password doesn't match")
      id = smart_str(urlsafe_base64_decode(uid))
      user = User.objects.get(id=id)
      if not PasswordResetTokenGenerator().check_token(user,token):
        raise serializers.ValidationError('Token is not Valid and Expired')
      user.set_password(password)
      user.save()
      return attrs
    except DjangoUnicodeDecodeError as identifier:
       PasswordResetTokenGenerator().check_token(user,token)
       raise serializers.ValidationError('Token is not Valid and Expired')
