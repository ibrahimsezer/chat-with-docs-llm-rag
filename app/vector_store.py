import os
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

FAISS_PATH = "./data/faiss_index"

embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-exp-03-07", google_api_key=os.getenv("GEMINI_API_KEY"))
vectorstore = None

def load_faiss():
    global vectorstore
    if os.path.exists(FAISS_PATH):
        print("[FAISS] Kayıtlı index bulundu, yükleniyor...")
        vectorstore = FAISS.load_local(FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    else:
        print("[FAISS] Kayıtlı index yok, yeni oluşturulacak.")
        vectorstore = None

def save_faiss():
    global vectorstore
    if vectorstore is not None:
        vectorstore.save_local(FAISS_PATH)
        print("[FAISS] Index kaydedildi.")

def add_to_vector_store_faiss(chunks: list[str], doc_id: str, user_id: str):
    global vectorstore
    print(f"[FAISS] {len(chunks)} chunk ekleniyor...")
    docs = [Document(page_content=chunk, metadata={"doc_id": doc_id, "user_id": user_id}) for chunk in chunks]
    if vectorstore is None:
        vectorstore = FAISS.from_documents(docs, embeddings)
    else:
        vectorstore.add_documents(docs)
    save_faiss()
    print("[FAISS] Ekleme ve kaydetme tamamlandı.")

def search_faiss(question: str, doc_id: str, user_id: str, top_k: int = 3):
    global vectorstore
    if vectorstore is None:
        print("[FAISS] Vectorstore boş, arama yapılamaz.")
        return []
    docs = vectorstore.similarity_search(question, k=top_k*3)
    filtered_docs = [doc.page_content for doc in docs if doc.metadata.get("doc_id") == doc_id and doc.metadata.get("user_id") == user_id]
    return filtered_docs[:top_k]

# Uygulama başlatılırken indexi yükle
load_faiss()
