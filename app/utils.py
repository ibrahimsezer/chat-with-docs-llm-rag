import os
from dotenv import load_dotenv
import google.generativeai as genai
import fitz  # PyMuPDF
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def ask_gemini(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"[HATA] Gemini yanıt üretirken hata oluştu: {e}")
        return "AI cevabı oluşturulamadı. Sunucu hatası."



def extract_text_from_pdf(path: str) -> str:
    text = ""
    with fitz.open(path) as doc:
        for page in doc:
            text += page.get_text()
    return text
