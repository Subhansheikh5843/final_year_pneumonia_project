import os
from dotenv import load_dotenv
import tensorflow as tf
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

load_dotenv()

llm = ChatGoogleGenerativeAI(
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    model="gemini-2.0-flash-001"
)
dic = {'NORMAL': 0, 'PNEUMONIA': 1}
target = {v: k for k, v in dic.items()}

# Prompt template
template = """
You are a medical chatbot assistant specializing in disease prediction. If a disease is mentioned, provide its causes, symptoms, and precautions. Do not recommend medications. Always remind the user to consult a doctor for more details. If the user is healthy or normal , appreciate them for taking care of their health. Keep your answers concise, empathetic, and under 50 words.

User: {user_question}
Assistant:
"""
prompt = PromptTemplate(input_variables=["user_question"], template=template)

system_prompt = (
    "You are a medical chatbot. "
    "Answer user questions related to diseases, symptoms, treatments, and other medical issues. "
    "Provide accurate, brief, and concise responses."
)

# Load models
pneumonia_model = tf.keras.models.load_model(
    r'C:\Users\Subhan Sheikh\Desktop\final_year\final_year_project_full-stack\djangoauthapi1\AI_models\pneumonia-model.keras'
)



