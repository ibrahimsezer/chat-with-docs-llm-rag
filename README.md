# 📄 Chat With Your Documents - LLM + RAG + FAISS (Secure, Multi-User, Offline with Ollama)

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-async-green?logo=fastapi)
![FAISS](https://img.shields.io/badge/FAISS-vectorstore-orange)
![LangChain](https://img.shields.io/badge/LangChain-embeddings-yellow)
![Ollama](https://img.shields.io/badge/Ollama-local--LLM-brightgreen)

A secure, private, open-source chatbot that allows **multiple users** to upload PDF documents and ask questions using AI (RAG). Each user's data is isolated and protected. Built with FastAPI, persistent FAISS vector store, and **local LLMs/embeddings via Ollama** (no external API required).

---

## 🧠 Features
- 📄 **Upload PDFs** and ask natural language questions
- 🔒 **User isolation**: Each user can only access their own documents
- 🚦 **Rate limiting**: Prevents abuse (1 upload/day, 1 query/min, 3 queries/day per user)
- 💾 **Persistent FAISS vector store** (secure, not user-uploadable)
- 🧩 **RAG pipeline**: Embedding + vector similarity search + LLM answer
- 🌐 **FastAPI backend** (REST endpoints)
- 🛡️ **Security best practices** (file type/size checks, no direct file access)
- 🐳 **Docker Compose** for easy, reproducible deployment
- 🦙 **Ollama** for fully offline LLM and embedding (phi3-mini, mistral, nomic-embed-text)

---

## ⚙️ Tech Stack
- ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python) Python, FastAPI
- ![FAISS](https://img.shields.io/badge/-FAISS-orange) FAISS (vector DB, persistent)
- ![LangChain](https://img.shields.io/badge/-LangChain-yellow) LangChain (embeddings)
- ![Ollama](https://img.shields.io/badge/-Ollama-brightgreen) Ollama (local LLM/embeddings)
- ![Docker](https://img.shields.io/badge/-Docker-blue) Docker Compose (multi-service)

---

## 🚀 How It Works

```
flowchart TD
    A[User uploads PDF] -->|/upload| B[Server: PDF split & embed (Ollama)]
    B --> C[FAISS: Add chunks (user_id, doc_id)]
    D[User asks question] -->|/ask-doc| E[Server: Query FAISS (user_id, doc_id)]
    E --> F[Relevant chunks]
    F --> G[LLM (Ollama) generates answer]
    G --> H[Answer to user]
```

---

## 📦 Run Locally (with Docker Compose)

### 1. **Clone the repository**
```bash
git clone ...
cd chat-with-docs-llm-rag
```

### 2. **Configure Environment**
Create a `.env` file in the root:
```env
# For Docker Compose (default)
OLLAMA_URL=http://ollama:11434
LLM_MODEL=phi3-mini
EMBED_MODEL=nomic-embed-text
```

### 3. **Start All Services**
```bash
docker compose up --build
```
- Ollama, backend, and frontend will all start and connect automatically.
- Access the frontend at [http://localhost:5173](http://localhost:5173)
- Backend API at [http://localhost:8000](http://localhost:8000)

### 4. **(Optional) Run Locally Without Docker**
- Start Ollama manually: `ollama serve` (or via Docker: `docker run -d -p 11434:11434 ollama/ollama`)
- Set `.env`:
  ```env
  OLLAMA_URL=http://localhost:11434
  LLM_MODEL=phi3-mini
  EMBED_MODEL=nomic-embed-text
  ```
- Install requirements: `pip install -r requirements.txt`
- Start backend: `uvicorn app.main:app --reload`

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
- **No external API keys required:** All LLM/embedding is local via Ollama
- **Rate limiting:** In-memory per user (for production, use Redis or similar)
- **File permissions:** Restrict `faiss_index` and `uploads` to server user

---

## 🐳 Docker Compose Overview

- **Ollama**: Serves local LLMs and embedding models
- **Backend**: FastAPI, LangChain, FAISS, connects to Ollama
- **Frontend**: React/Vite, connects to backend
- **Persistent volumes**: For Ollama models and FAISS index

---

## 💡 Notes
- Make sure to pull Ollama models you want to use (e.g. `ollama pull phi3-mini`, `ollama pull nomic-embed-text`)
- You can swap LLM/embedding models by changing `.env` and restarting services
- For production, consider using a more robust rate limiting and user/session management

