import hashlib
import random


def split_text(text: str, max_chunk_size: int = 500) -> list[str]:
    sentences = text.split(". ")
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_chunk_size:
            current_chunk += sentence + ". "
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def fake_embed(text: str) -> list[float]:
    return [random.random() for _ in range(384)]
