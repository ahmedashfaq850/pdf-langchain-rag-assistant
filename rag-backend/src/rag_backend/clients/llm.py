from langchain_google_genai import ChatGoogleGenerativeAI
from rag_backend.config import config


def get_llm_model() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(model=config.GEMINI_MODEL, api_key=config.GEMINI_API_KEY)
