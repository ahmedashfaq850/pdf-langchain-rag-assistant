import os
from pathlib import Path
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass
class Config:
    CURRENT_DIR: Path
    DATA_DIR: Path
    CHROMA_PERSIST_DIR: str
    GEMINI_API_KEY: str
    GEMINI_MODEL: str
    EMBEDDING_MODEL_NAME: str
    VECTOR_STORE_COLLECTION_NAME: str
    CHUNK_SIZE: int
    CHUNK_OVERLAP: int

    @classmethod
    def load(cls):
        # Get base directories
        current_dir = Path(__file__).parent
        data_dir = current_dir / "data"

        # Get API keys from environment
        gemini_key = os.getenv("GOOGLE_API_KEY")
        gemini_model = os.getenv("MODEL")

        # Make sure we have the required keys
        if not gemini_key:
            raise ValueError("GOOGLE_API_KEY is required")
        if not gemini_model:
            raise ValueError("MODEL is required")

        return cls(
            CURRENT_DIR=current_dir,
            DATA_DIR=data_dir,
            CHROMA_PERSIST_DIR="chroma_db",
            GEMINI_API_KEY=gemini_key,
            GEMINI_MODEL=gemini_model,
            EMBEDDING_MODEL_NAME="sentence-transformers/all-MiniLM-L6-v2",
            VECTOR_STORE_COLLECTION_NAME="pdf_data",
            CHUNK_SIZE=1000,
            CHUNK_OVERLAP=200,
        )


# Create config instance
config = Config.load()
