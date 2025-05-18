import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain import hub

from rag_backend.config import config
from rag_backend.clients import get_llm_model, get_vector_store

# initialize ChromaDB
vector_store = get_vector_store()
# Initialize clients
llm_model = get_llm_model()


def get_pdf_files():
    if not os.path.exists(config.DATA_DIR):
        raise FileNotFoundError(f"Data directory not found at: {config.DATA_DIR}")

    pdf_files = []
    for file in os.listdir(config.DATA_DIR):
        if file.lower().endswith(".pdf"):
            pdf_files.append(file)

    return pdf_files


def read_pdf(file_name):
    file_path = os.path.join(config.DATA_DIR, file_name)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found at: {file_path}")
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    return docs


def split_text(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=config.CHUNK_SIZE, chunk_overlap=config.CHUNK_OVERLAP
    )
    return text_splitter.split_documents(docs)


def add_collection_to_chroma(splitted_docs, vector_store):
    ids = [str(i + 1) for i in range(len(splitted_docs))]
    vector_store.add_documents(documents=splitted_docs, ids=ids)
    return {
        "status": "success",
        "message": "Document successfully processed and stored",
        "chunks": len(splitted_docs),
    }


def build_rag_pipeline():
    pdf_file = get_pdf_files()[0]
    read_file = read_pdf(pdf_file)
    splitted_docs = split_text(read_file)
    result = add_collection_to_chroma(splitted_docs, vector_store)
    return result


def retrieve_answer(input_query):
    retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    llm = llm_model
    retriever = vector_store.as_retriever()
    combine_docs_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)
    retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

    response = retrieval_chain.invoke({"input": input_query})
    return response["answer"]
