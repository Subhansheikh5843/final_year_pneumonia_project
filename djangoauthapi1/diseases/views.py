import os
import cv2
import json
import logging
from dotenv import load_dotenv
import numpy as np
from django.db import transaction
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Pneumonia
from .serializers import (
    PneumoniaSerializer,
    GetPneumoniaSerializer,
)
from langchain_core.messages import (SystemMessage,
                                     HumanMessage,
                                     AIMessage)
from langgraph.graph import (START,
                             MessagesState,
                             StateGraph)
from langgraph.checkpoint.memory import MemorySaver
from django.views.decorators.csrf import csrf_exempt
from .helpers.constants import (
    pneumonia_model,
    prompt,
    llm,
    target,
    system_prompt,
)
from .helpers.utils import preprocess_image

load_dotenv()

logger = logging.getLogger("your_app.views")

class PneumoniaView(APIView):
    """
    API endpoint for uploading chest X-ray images and retrieving AI-based pneumonia predictions.

    Permissions:
        IsAuthenticated: Only authenticated users can upload images or delete records.
    """
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, format=None):
        """
        Handle POST requests to upload an X-ray image, run pneumonia prediction,
        update the record with the result, and optionally invoke an LLM for details.

        Steps:
            1. Validate and save the uploaded image via PneumoniaSerializer.
            2. Preprocess the image and generate a prediction using the pneumonia model.
            3. Update the Pneumonia instance with the prediction text.
            4. Invoke an LLM prompt to obtain explanatory details.

        Returns:
            201 CREATED with {predicted_text, details} on success.
            400 BAD REQUEST with error message on failure.
        """
        logger.info("Received POST /pneumonia request from user %s", request.user)

        serializer = PneumoniaSerializer(
            data=request.data,
            context={'request': request}
        ) 
        logger.info("Serializer initialized with request data")

        if serializer.is_valid():
            logger.info("Serializer is valid")
            upload = serializer.save()
            logger.info("Upload record saved with ID %s", upload.id)

            image = request.FILES.get('image')
            if image:
                logger.info("Image file received: %s", image)
                media_root = settings.MEDIA_ROOT
                image_path = os.path.join(media_root, 'uploads', str(image))
                logger.info("Image path resolved to: %s", image_path)

                logger.info("Starting pneumonia image preprocessing")
                preprocessed = preprocess_image(image_path)
                logger.info("Image preprocessed: shape %s", preprocessed.shape)

                logger.info("Running pneumonia model prediction")
                preds = pneumonia_model.predict(preprocessed)
                classs = int(np.argmax(preds, axis=1)[0])
                label = target[classs]
                prob = float(np.max(preds))
                logger.info("Predicted class: %s, probability: %.2f", label, prob)

                formatted_prompt = prompt.format(user_question=label)
                logger.info("Formatted prompt for LLM")
                predicted_text = f"Predicted: {label} ({prob:.2f})"
                upload.predicted_text = predicted_text
                upload.save()
                logger.info("Upload record %s updated with predicted_text", upload.id)

                try:
                    logger.info("Invoking LLM")
                    llm_resp = llm.invoke(formatted_prompt)
                    details = llm_resp.content
                    logger.info("LLM response received (length %d)", len(details))

                    return Response(
                        {
                            "predicted_text": upload.predicted_text,
                            "details": details,
                        },
                        status=status.HTTP_201_CREATED
                    )
                except Exception as e:
                    logger.exception("Error during LLM invocation, rolling back")
                    transaction.set_rollback(True)
                    Pneumonia.objects.filter(id=upload.id).delete()
                    logger.info("Deleted upload record %s due to LLM failure", upload.id)
                    return Response(
                        {"error": "LLM Response Error"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            else:
                logger.warning("No image was uploaded in the request")
                return Response(
                    {"error": "No image uploaded"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        logger.warning("Serializer is invalid: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        """
        Handle DELETE requests to remove all Pneumonia records for the authenticated user.

        Returns:
            200 OK with deletion summary message.
        """
        user = request.user
        logger.info("Received DELETE /pneumonia request from user %s", user)
        deleted_count, _ = Pneumonia.objects.filter(user=user).delete()
        logger.info("Deleted %d records for user %s", deleted_count, user)
        return Response(
            {"message": f"Deleted {deleted_count} Pneumonia prediction(s)."},
            status=status.HTTP_200_OK
        )


class UserPneumoniaRecordsView(APIView):
    """
    API endpoint for retrieving all pneumonia prediction records
    associated with the authenticated user.

    Permissions:
        IsAuthenticated: Only logged-in users can access their records.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET requests to list all Pneumonia records for the current user.

        Steps:
            1. Filter Pneumonia objects by the requesting user.
            2. Serialize the queryset using GetPneumoniaSerializer.
            3. Return serialized data in the response.

        Returns:
            200 OK with a list of serialized Pneumonia records.
        """
        user = request.user
        records = Pneumonia.objects.filter(user=user)
        serializer = GetPneumoniaSerializer(records, many=True)
        return Response(serializer.data)
    


workflow = StateGraph(state_schema=MessagesState)

def call_model(state: MessagesState):
    """
    Call the LLM with accumulated messages.

    Args:
        state (MessagesState): Current conversation messages state.

    Returns:
        dict: New state containing the AI response message list.
    """
    logger.info("call_model: preparing messages for LLM invocation")
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    logger.debug("call_model: messages payload: %s", messages)
    response = llm.invoke(messages)
    logger.info("call_model: received response from LLM")
    return {"messages": response}


workflow.add_node("model", call_model)
workflow.add_edge(START, "model")
logger.info("Workflow graph initialized with node 'model'")

memory = MemorySaver()
logger.info("MemorySaver instantiated for workflow checkpointer")

app = workflow.compile(checkpointer=memory)
logger.info("Workflow app compiled and ready to invoke")

@csrf_exempt
def chatbot_view(request):
    """
    Django view to handle chatbot POST requests.

    Accepts JSON with 'message' and optional 'thread_id', invokes the workflow,
    and returns the AI-generated response.

    Methods:
        POST: Process a user message and return AI response.

    Returns:
        JsonResponse: {response: str} on success or {error: str} on failure.
    """
    if request.method != "POST":
        logger.warning("chatbot_view: invalid request method %s", request.method)
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        logger.info("chatbot_view: parsing request body")
        data = json.loads(request.body)
        user_message = data.get("message", "")
        thread_id = data.get("thread_id", "default-thread-id")

        if not user_message:
            logger.warning("chatbot_view: missing 'message' in request")
            return JsonResponse({"error": "Message is required"}, status=400)

        logger.info("chatbot_view: invoking workflow with thread_id %s", thread_id)
        response = app.invoke(
            {"messages": [HumanMessage(content=user_message)]},
            config={"configurable": {"thread_id": thread_id}},
        )

        ai_message = response["messages"][-1]
        ai_response = ai_message.content if isinstance(ai_message, AIMessage) else str(ai_message)
        logger.info("chatbot_view: received AI response")
        return JsonResponse({"response": ai_response})
    except Exception as e:
        logger.exception("chatbot_view: error processing request")
        return JsonResponse({"error": str(e)}, status=500)
