import os
import requests
from langchain.embeddings.base import Embeddings

class OllamaEmbeddings(Embeddings):
    def __init__(self, model: str = None, url: str = None):
        self.model = model or os.getenv("EMBED_MODEL", "nomic-embed-text")
        self.url = url or os.getenv("OLLAMA_URL", "http://ollama:11434")

    def embed_documents(self, texts):
        response = requests.post(
            f"{self.url}/api/embeddings",
            json={"model": self.model, "prompt": texts}
        )
        response.raise_for_status()
        return response.json()["embeddings"]

    def embed_query(self, text):
        return self.embed_documents([text])[0]