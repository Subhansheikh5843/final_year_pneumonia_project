from django.urls import path
from .views import (
    PneumoniaView,
    UserPneumoniaRecordsView,
    chatbot_view
)

urlpatterns = [
    path('pneumonia/', PneumoniaView.as_view(), name='pneumonia-segment'),
    path('user-pneumonia-records/', UserPneumoniaRecordsView.as_view(), name='user-segment-records'),
    path("chatbot/", chatbot_view, name="chatbot"),
]

