import chromadb
from langchain_chroma import Chroma
from rag_backend.config import config
from .embeddings import get_embedding_model


def get_vector_store() -> Chroma:
    embedding_model = get_embedding_model()

    return Chroma(
        collection_name=config.VECTOR_STORE_COLLECTION_NAME,
        embedding_function=embedding_model,
        persist_directory=config.CHROMA_PERSIST_DIR,
    )


def inspect_chroma_db():
    client = chromadb.PersistentClient(path=config.CHROMA_PERSIST_DIR)
    collections = client.list_collections()

    if not collections:
        print("[⚠️] No collections found in Chroma DB.")
        return

    print(f"[✅] Collections in Chroma DB at '{config.CHROMA_PERSIST_DIR}':")
    for col in collections:
        print(f"- Name: {col.name}, ID: {col.id}")

    try:
        collection = client.get_collection(name=config.VECTOR_STORE_COLLECTION_NAME)
        print(
            f"\n[INFO] Collection '{config.VECTOR_STORE_COLLECTION_NAME}' found with {collection.count()} embeddings."
        )
    except Exception as e:
        print(
            f"[❌] Error accessing collection '{config.VECTOR_STORE_COLLECTION_NAME}':",
            e,
        )
