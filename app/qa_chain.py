from app.utils import ask_gemini

def generate_answer(query: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)

    prompt = f"""
Kullanıcıdan gelen soru:
{query}

Aşağıda bu soruyla ilgili belge içerikleri verilmiştir. Lütfen sadece bu içeriklere dayanarak açık, sade ve doğru bir yanıt üret.

Belgelerden Alınan İçerikler:
{context}
"""

    return ask_gemini(prompt)
