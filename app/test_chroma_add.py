import chromadb
from chromadb.config import Settings
import random
import uuid

client = chromadb.Client(Settings(
    persist_directory="./data/chroma_test",
    anonymized_telemetry=False
))

collection = client.get_or_create_collection(name="test_docs")

def fake_embed(text: str) -> list[float]:
    return [random.random() for _ in range(384)]

doc_id = str(uuid.uuid4())
chunk = "Bu örnek bir chunk içeriğidir. Chroma test ediliyor."

try:
    print(f"Ekleniyor: {doc_id}_chunk_0")
    collection.add(
        documents=[chunk],
        ids=[f"{doc_id}_chunk_0"],
        embeddings=[fake_embed(chunk)],
        metadatas=[{"doc_id": doc_id}]
    )
    print("Başarıyla eklendi.")
except Exception as e:
    print(f"[HATA] Veri eklenemedi: {e}")
