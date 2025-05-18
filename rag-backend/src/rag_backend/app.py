import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from rag_backend import rag
from rag_backend.config import config

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


class ChatQuery(BaseModel):
    query: str


class ChatResponse(BaseModel):
    answer: str


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)) -> Dict[str, Any]:
    try:
        # Create data directory if it doesn't exist
        os.makedirs(config.DATA_DIR, exist_ok=True)

        # Save the uploaded file temporarily
        file_path = os.path.join(config.DATA_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the PDF using the RAG pipeline
        result = rag.build_rag_pipeline()

        # Clean up - remove the temporary file
        os.remove(file_path)

        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/chat-pdf", response_model=ChatResponse)
async def chat_with_pdf(query: ChatQuery) -> ChatResponse:
    try:
        answer = rag.retrieve_answer(query.query)
        return ChatResponse(answer=answer)
    except Exception as e:
        return ChatResponse(answer=f"Error: {str(e)}")
