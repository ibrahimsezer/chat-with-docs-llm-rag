from dotenv import load_dotenv
import fitz  # PyMuPDF
load_dotenv()



def extract_text_from_pdf(path: str) -> str:
    text = ""
    with fitz.open(path) as doc:
        for page in doc:
            text += page.get_text()
    return text
