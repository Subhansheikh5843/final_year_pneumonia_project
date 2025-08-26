from django.urls import path
from account.views import (
    UserChangePasswordView,
    SendPasswordResetEmailView,
    UserPasswordResetView,
    UserRegisterationView,
    UserLoginView
)
urlpatterns = [
    path("register/", UserRegisterationView.as_view(),name='register'),
    path("login/", UserLoginView.as_view(),name='login'),
    path("changepassword/", UserChangePasswordView.as_view(),name='changepassword'),
    path("send-reset-password-email/", SendPasswordResetEmailView.as_view(),name='send-reset-password-email'),
    path("reset-password/<uid>/<token>/", UserPasswordResetView.as_view(),name='reset-password'),
]
