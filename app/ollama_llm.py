import os
import requests
from langchain.llms.base import LLM

class OllamaLLM(LLM):
    def __init__(self, model: str = None, url: str = None, **kwargs):
        super().__init__(**kwargs)
        self._model = model or os.getenv("LLM_MODEL", "phi3-mini")
        self._url = url or os.getenv("OLLAMA_URL", "http://ollama:11434")

    @property
    def _llm_type(self):
        return "ollama"

    def _call(self, prompt, stop=None, **kwargs):
        payload = {
            "model": self._model,
            "prompt": prompt,
        }
        response = requests.post(f"{self._url}/api/generate", json=payload)
        response.raise_for_status()
        return response.json()["response"]