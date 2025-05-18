from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os
from tempfile import NamedTemporaryFile
from rag_backend.rag import process_pdf_content
from rag_backend.config import config
from langchain_community.document_loaders import PyPDFLoader

app = FastAPI()

# You might want to adjust these constants based on your needs
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Check file size
    file_size = 0
    file_content = await file.read()
    file_size = len(file_content)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE/1024/1024}MB",
        )

    try:
        # Create a temporary file
        with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(file_content)
            temp_path = temp_file.name

        try:
            # Load PDF content
            loader = PyPDFLoader(temp_path)
            pdf_content = loader.load()

            if not pdf_content:
                raise HTTPException(
                    status_code=400, detail="Could not extract content from PDF"
                )

            # Process the PDF content
            result = process_pdf_content(pdf_content)

            if result["status"] == "error":
                raise HTTPException(status_code=400, detail=result["message"])

            return result
        finally:
            # Clean up the temporary file
            os.unlink(temp_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    finally:
        file.file.close()
