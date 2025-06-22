import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi import UploadFile, File
from app.utils import ask_gemini
import os
from app.utils import extract_text_from_pdf
from app.embedding import split_text
from app.retriever import add_to_vector_store

from fastapi import Request
from app.retriever import get_relevant_chunks
from app.qa_chain import generate_answer

from app.retriever import collection

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/ask")
def ask(question: str):
    response = ask_gemini(question)
    return {"answer": response}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    print("PDF yükleme başladı...")
    doc_id = str(uuid.uuid4())
    file_path = f"./data/uploads/{file.filename}"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        print(f"{file.filename} dosyası kaydedildi. Boyut: {len(content)} bayt.")

    text = extract_text_from_pdf(file_path)
    print(f"PDF'ten alınan text uzunluğu: {len(text)} karakter.")

    chunks = split_text(text)
    print(f"{len(chunks)} chunk'a bölündü.")

    add_to_vector_store(chunks, doc_id=doc_id)

    print("Upload işlemi tamamlandı, response dönüyor.")
    return {
        "message": f"{file.filename} yüklendi ve işlendi.",
        "chunks": len(chunks),
        "doc_id": doc_id
    }


@app.get("/ask-doc")
def ask_from_documents(question: str, doc_id:str):
    try:
        print(f"Soru alındı: {question}| Belge ID:{doc_id}")
        
        chunks = get_relevant_chunks(question,doc_id)
        if not chunks:
            return JSONResponse(
                status_code=404,
                content={"message": "Bu belgeyle eşleşen veri bulunamadı."}
            )
            
        print(f"{len(chunks)} adet chunk eşleşti.")
        
        answer = generate_answer(question, chunks)
        print(f"Gemini cevabı: {answer[:100]}...")

        return {
            "question": question,
            "answer": answer,
            "context_used": chunks
        }

    except Exception as e:
        print(f"[HATA] ask-doc endpoint'inde sorun: {e}")
        return {"error": str(e)}

    
@app.get("/ask-test")
def ask_test():
    from app.utils import ask_gemini
    response = ask_gemini("Nasılsın?")
    return {"response": response}


