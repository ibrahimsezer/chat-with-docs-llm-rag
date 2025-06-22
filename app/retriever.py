import chromadb
from chromadb import Client
from chromadb.config import Settings
from app.embedding import fake_embed
import uuid

chroma_client = Client(Settings(
    persist_directory="./data/chroma",  
    anonymized_telemetry=False
))
collection = chroma_client.get_or_create_collection(name="documents")

def add_to_vector_store(chunks: list[str], doc_id: str):
    print(f"{len(chunks)} adet chunk '{doc_id}' ID'siyle ekleniyor...")
    
    for i, chunk in enumerate(chunks):
        try:
            unique_id = f"{doc_id}_chunk_{i}_{uuid.uuid4().hex}"
            emb = fake_embed(chunk)
            collection.add(
                documents=[chunk],
                ids=[unique_id],
                embeddings=[emb],
                metadatas=[{"doc_id": doc_id}],
            )
            print(f"{i+1}. chunk eklendi: {unique_id}")
        except Exception as e:
            print(f"[HATA] {i+1}. chunk eklenemedi: {e}")
    
    print("Veriler ChromaDB'ye eklendi.")


def get_relevant_chunks(query: str, doc_id:str, top_k: int = 3) -> list[str]:
    query_embedding = fake_embed(query)
    print(f"Embedding alındı: {query_embedding[:5]}...")

    try:
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where={"doc_id":doc_id}
        )
        print("Query sonucu alındı:", results)
        
    except Exception as e:
        print("[HATA] query sırasında hata:", e)
        return []

    return results["documents"][0] if results["documents"] else []
