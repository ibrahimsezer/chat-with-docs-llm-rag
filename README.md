# 📄 Chat With Your Documents - LLM + RAG + FAISS (Secure, Multi-User)

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-async-green?logo=fastapi)
![FAISS](https://img.shields.io/badge/FAISS-vectorstore-orange)
![LangChain](https://img.shields.io/badge/LangChain-embeddings-yellow)
![Gemini](https://img.shields.io/badge/Gemini-API-blueviolet)

A secure, private, open-source chatbot that allows **multiple users** to upload PDF documents and ask questions using AI (RAG). Each user's data is isolated and protected. Built with FastAPI, persistent FAISS vector store, and Gemini/OpenAI LLMs.

---

## 🧠 Features
- 📄 **Upload PDFs** and ask natural language questions
- 🔒 **User isolation**: Each user can only access their own documents
- 🚦 **Rate limiting**: Prevents abuse (1 upload/day, 1 query/min, 3 queries/day per user)
- 💾 **Persistent FAISS vector store** (secure, not user-uploadable)
- 🧩 **RAG pipeline**: Embedding + vector similarity search + LLM answer
- 🌐 **FastAPI backend** (REST endpoints)
- 🛡️ **Security best practices** (file type/size checks, API key via env, no direct file access)

---

## ⚙️ Tech Stack
- ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python) Python, FastAPI
- ![FAISS](https://img.shields.io/badge/-FAISS-orange) FAISS (vector DB, persistent)
- ![LangChain](https://img.shields.io/badge/-LangChain-yellow) LangChain (embeddings)
- ![Gemini](https://img.shields.io/badge/-Gemini-blueviolet) Gemini Pro API (or OpenAI)

---

## 🚀 How It Works

```
flowchart TD
    A[User uploads PDF] -->|/upload| B[Server: PDF split & embed]
    B --> C[FAISS: Add chunks (user_id, doc_id)]
    D[User asks question] -->|/ask-doc| E[Server: Query FAISS (user_id, doc_id)]
    E --> F[Relevant chunks]
    F --> G[LLM (Gemini/OpenAI) generates answer]
    G --> H[Answer to user]
```

---

## 📦 Run Locally

```bash
git clone ...
pip install -r requirements.txt
python app/main.py
```

---

## 🔗 API Endpoints

### 1. **Upload PDF**
`POST /upload`
- **Headers:** `X-USER-ID: <user_id>` (optional, else uses IP)
- **Body:** `multipart/form-data` (PDF file)
- **Rate limit:** 1 upload per user per day

**Example (Python requests):**
```python
import requests
files = {'file': open('mydoc.pdf', 'rb')}
headers = {'X-USER-ID': 'user123'}
r = requests.post('http://localhost:8000/upload', files=files, headers=headers)
print(r.json())
```

### 2. **Ask a Question**
`POST /ask-doc`
- **Headers:** `X-USER-ID: <user_id>` (optional, else uses IP)
- **Query params:** `question`, `doc_id`
- **Rate limit:** 1 query per minute, 3 per day per user

**Example:**
```python
import requests
params = {'question': 'What is the summary?', 'doc_id': '<doc_id_from_upload>'}
headers = {'X-USER-ID': 'user123'}
r = requests.post('http://localhost:8000/ask-doc', params=params, headers=headers)
print(r.json())
```

---

## 🛡️ Security & Best Practices
- **User isolation:** All data is tagged with `user_id` (from header or IP)
- **No user-uploaded index:** Only server-created FAISS index is used
- **File checks:** Only PDFs, max 10MB
- **API keys:** Use environment variables for Gemini/OpenAI keys
- **Rate limiting:** In-memory per user (for production, use Redis or similar)
- **File permissions:** Restrict `faiss_index` and `uploads` to server user

