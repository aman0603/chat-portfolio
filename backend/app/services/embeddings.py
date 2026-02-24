import os
from sentence_transformers import SentenceTransformer
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

# Force offline mode for faster startup if model is already downloaded
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"

@lru_cache(maxsize=1)
def _get_model() -> SentenceTransformer:
    """Lazy-load the embedding model (only loaded on first call)."""
    try:
        logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
        # Try local first
        return SentenceTransformer("all-MiniLM-L6-v2")
    except Exception as e:
        logger.warning(f"Offline load failed, attempting online download: {e}")
        os.environ["TRANSFORMERS_OFFLINE"] = "0"
        os.environ["HF_HUB_OFFLINE"] = "0"
        return SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> list[float]:
    """Generate embedding vector for the given text."""
    model = _get_model()
    # clean text to reduce unnecessary computation
    clean_text = text.strip().replace("\n", " ")
    return model.encode(clean_text, convert_to_numpy=True).tolist()
