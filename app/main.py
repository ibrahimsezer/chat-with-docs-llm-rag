import uuid
import time
import os
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query, Request
from fastapi.responses import JSONResponse
from fastapi import UploadFile, File, HTTPException
from app.ollama_embeddings import OllamaEmbeddings
from app.ollama_llm import OllamaLLM
from app.utils import ask_gemini
from app.utils import extract_text_from_pdf
from app.embedding import split_text
from app.vector_store import add_to_vector_store_faiss, search_faiss
from app.qa_chain import generate_answer




embeddings = OllamaEmbeddings()
llm = OllamaLLM()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory rate limiters: {user_id: [timestamps]}
upload_limits = {}
ask_limits = {}

PDF_MIME_TYPES = ["application/pdf"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# Setup logging
logging.basicConfig(level=logging.INFO)

# Helper: get user_id from header (or fallback to IP)
def get_user_id(request: Request):
    user_id = request.headers.get("X-USER-ID")
    if not user_id:
        user_id = request.client.host  # fallback to IP
    return user_id

@app.get("/ask")
def ask(question: str):
    response = llm(question)
    return {"answer": response}

@app.post("/upload")
async def upload_pdf(request: Request, file: UploadFile = File(...)):
    user_id = get_user_id(request)
    now = time.time()
    # Rate limit: günde 1 yükleme
    timestamps = upload_limits.get(user_id, [])
    timestamps = [t for t in timestamps if now - t < 86400]
    if len(timestamps) >= 1:
        raise HTTPException(status_code=429, detail="Günde sadece 1 PDF yükleyebilirsiniz.")
    # Dosya türü ve boyut kontrolü
    if file.content_type not in PDF_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Sadece PDF dosyası yükleyebilirsiniz.")
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Dosya boyutu 10MB'dan büyük olamaz.")
    doc_id = str(uuid.uuid4())
    upload_dir = "./data/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    try:
        with open(file_path, "wb") as f:
            f.write(content)
        logging.info(f"{file.filename} dosyası kaydedildi. Boyut: {len(content)} bayt.")
        text = extract_text_from_pdf(file_path)
        logging.info(f"PDF'ten alınan text uzunluğu: {len(text)} karakter.")
        chunks = split_text(text)
        logging.info(f"{len(chunks)} chunk'a bölündü.")
        add_to_vector_store_faiss(chunks, doc_id=doc_id, user_id=user_id)
    except Exception as e:
        logging.error(f"Upload veya embedding işlemi sırasında hata: {e}")
        raise HTTPException(status_code=500, detail="Dosya işlenirken hata oluştu.")
    # Rate limit güncelle
    timestamps.append(now)
    upload_limits[user_id] = timestamps
    logging.info("Upload işlemi tamamlandı, response dönüyor.")
    return {
        "message": f"{file.filename} yüklendi ve işlendi.",
        "chunks": len(chunks),
        "doc_id": doc_id
    }

@app.post("/ask-doc")
def ask_from_documents(request: Request, question: str = Query(description="Sorulacak soru"),
    doc_id: str = Query(description="Belge ID'si")):
    user_id = get_user_id(request)
    now = time.time()
    # Input validation
    if not question or not doc_id:
        raise HTTPException(status_code=400, detail="Soru ve belge ID'si zorunludur.")
    # Rate limit: dakikada 1, günde 3 sorgu
    timestamps = ask_limits.get(user_id, [])
    timestamps = [t for t in timestamps if now - t < 86400]
    minute_count = len([t for t in timestamps if now - t < 60])
    if minute_count >= 1:
        raise HTTPException(status_code=429, detail="Dakikada sadece 1 sorgu yapabilirsiniz.")
    if len(timestamps) >= 3:
        raise HTTPException(status_code=429, detail="Günde en fazla 3 sorgu yapabilirsiniz.")
    logging.info(f"Soru alındı: {question}| Belge ID:{doc_id}| User:{user_id}")
    try:
        chunks = search_faiss(question, doc_id, user_id)
        if not chunks:
            return JSONResponse(
                status_code=404,
                content={"message": "Bu belgeyle eşleşen veri bulunamadı."}
            )
        logging.info(f"{len(chunks)} adet chunk eşleşti.")
        answer = generate_answer(question, chunks)
        logging.info(f"Ollama cevabı: {answer[:100]}...")
    except Exception as e:
        logging.error(f"Sorgu veya LLM işlemi sırasında hata: {e}")
        raise HTTPException(status_code=500, detail="Yanıt oluşturulurken hata oluştu.")
    # Rate limit güncelle
    timestamps.append(now)
    ask_limits[user_id] = timestamps
    return {
        "question": question,
        "answer": answer,
        "context_used": chunks
    }

@app.get("/ask-test")
def ask_test():
    response = llm("Nasılsın?")
    return {"response": response}


