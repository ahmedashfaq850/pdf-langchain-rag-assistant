# 📘 PDF RAG LangChain Assistant

**PDF RAG Assistant** is an intelligent document analysis system that leverages Language Models and vector databases for sophisticated PDF document processing. Users can upload PDFs and engage in natural conversations about their content, with the system providing context-aware responses based on the document contents.

---

## 🎥 Demo Video

https://github.com/user-attachments/assets/5679e097-73ca-4f4d-bb40-55c2a73df1d2

---

## 🧩 Architecture Diagram

<img width="797" alt="Image" src="https://github.com/user-attachments/assets/16be3b4c-c1cd-4d2b-80e1-7562df42392a" />

---

## 🔁 Flow Diagram

<img width="713" alt="Image" src="https://github.com/user-attachments/assets/56789a8e-805f-488d-bfc6-c796efb91205" />

---

## 🚀 Key Features

| **Feature**            | **Description**                                                                 |
|------------------------|---------------------------------------------------------------------------------|
| 📄 PDF Processing      | Efficient handling of PDF documents using **PyPDF** and **Unstructured** for text extraction |
| 🔄 Text Processing     | Advanced text splitting with **LangChain text splitters** for optimal chunk management |
| 🧠 Vector Storage      | **ChromaDB** integration for efficient storage and retrieval of document embeddings |
| 💬 Interactive QA      | Natural language interaction with document content using **LangChain** |
| ⚙️ FastAPI Backend     | Robust API infrastructure using **FastAPI** for quick response times |
| 🖥️ Next.js Frontend    | Dynamic and modern frontend built with **Next.js** and **React** |

---

## 🛠️ Tech Stack Highlights

| **Component**          | **Technologies**                                   |
|------------------------|-----------------------------------------------------|
| Backend Framework      | FastAPI + Uvicorn                                   |
| PDF Processing         | PyPDF + Unstructured                                |
| Vector Database        | ChromaDB                                            |
| LLM Integration        | LangChain + Google Generative AI                    |
| Text Processing        | Sentence Transformers                               |
| Frontend Framework     | Next.js + React                                     |

---

## 📦 Use Cases

- **📚 Document Analysis:** Extract and analyze information from complex PDF documents  
- **🔬 Research Assistant:** Help researchers quickly find relevant information in academic papers  
- **📑 Legal Document Review:** Assist in analyzing legal documents and contracts  
- **🛠️ Technical Documentation:** Navigate and query technical manuals and documentation  
- **🎓 Educational Support:** Help students understand and learn from PDF textbooks and materials  

---

## 🧪 Development Approach

- ✅ Using `asyncio` for handling concurrent operations efficiently  
- ✅ Implementing `black` for consistent code formatting  
- ✅ Leveraging `sentence-transformers` for high-quality text embeddings  
- ✅ Managing environment variables securely with `dotenv`  
- ✅ Utilizing `Pydantic` for robust data validation and serialization  
