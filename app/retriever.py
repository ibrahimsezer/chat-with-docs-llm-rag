import chromadb
from chromadb.config import Settings

from app.embedding import fake_embed

chroma_client = chromadb.PersistentClient(path="./data/chroma")
collection = chroma_client.get_or_create_collection(name="documents")

def add_to_vector_store(chunks: list[str]):
    for i, chunk in enumerate(chunks):
        emb = fake_embed(chunk)  # sonra gerçek embedding fonksiyonuyla değiştir
        collection.add(
            documents=[chunk],
            ids=[f"chunk_{i}"],
            embeddings=[emb]
        )


def get_relevant_chunks(query: str, top_k: int = 3) -> list[str]:
    query_embedding = fake_embed(query)
    print(f"Embedding alındı: {query_embedding[:5]}...")

    try:
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        print("Query sonucu alındı:", results)
    except Exception as e:
        print("[HATA] query sırasında hata:", e)
        return []

    return results["documents"][0]
