from fastapi import FastAPI
from app.utils import ask_gemini
from fastapi import UploadFile, File
import os
from app.utils import extract_text_from_pdf
from app.embedding import split_text
from app.retriever import add_to_vector_store
from fastapi.middleware.cors import CORSMiddleware

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
    file_path = f"./data/uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)
    print(f"Extracted text length: {len(text)}")
    print(f"İlk 300 karakter:\n{text[:300]}")
    chunks = split_text(text)
    add_to_vector_store(chunks)

    return {"message": f"{file.filename} yüklendi ve işlendi.", "chunks": len(chunks)}


@app.get("/ask-doc")
def ask_from_documents(question: str):
    try:
        print(f"Soru alındı: {question}")
        chunks = get_relevant_chunks(question)
        print(f"{len(chunks)} adet chunk bulundu.")

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


