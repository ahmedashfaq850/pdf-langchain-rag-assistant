from langchain_huggingface import HuggingFaceEmbeddings
from rag_backend.config import config


def get_embedding_model() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL_NAME)
