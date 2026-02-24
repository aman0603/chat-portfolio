"""
Vector store backed by Supabase pgvector.

Replaces the local ChromaDB implementation so that embeddings are stored
in PostgreSQL and survive deployments without any local file system.
"""
import hashlib
import os

import psycopg2
import psycopg2.extras

from .embeddings import generate_embedding


# ---------------------------------------------------------------------------
# DB connection
# ---------------------------------------------------------------------------

def _get_conn():
    """Open a fresh psycopg2 connection using DATABASE_URL from env."""
    url = os.environ.get("DATABASE_URL") or ""
    if not url:
        # Fallback: try importing settings (may fail during early boot)
        from ..config import settings
        url = settings.DATABASE_URL
    return psycopg2.connect(url)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _generate_chunk_id(text: str) -> str:
    """Deterministic SHA-256 content hash used as deduplication key."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _vec_literal(embedding: list[float]) -> str:
    """Format a Python float list as a pgvector literal string, e.g. '[0.1,0.2,…]'."""
    return "[" + ",".join(str(x) for x in embedding) + "]"


# ---------------------------------------------------------------------------
# Public API  (same interface as the ChromaDB version)
# ---------------------------------------------------------------------------

def count() -> int:
    """Return the total number of documents stored."""
    conn = _get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM document_embeddings")
            return cur.fetchone()[0]
    finally:
        conn.close()


def add_documents(text_chunks: list[str]) -> int:
    """
    Embed and insert text chunks into pgvector.
    Skips chunks that already exist (deduplication by content hash).
    Returns the number of *newly* added chunks.
    """
    if not text_chunks:
        return 0

    added = 0
    conn = _get_conn()
    try:
        with conn.cursor() as cur:
            for chunk in text_chunks:
                chunk_id = _generate_chunk_id(chunk)
                embedding = generate_embedding(chunk)
                vec_str = _vec_literal(embedding)

                cur.execute(
                    """
                    INSERT INTO document_embeddings (chunk_id, content, embedding)
                    VALUES (%s, %s, %s::vector)
                    ON CONFLICT (chunk_id) DO NOTHING
                    """,
                    (chunk_id, chunk, vec_str),
                )
                added += cur.rowcount
        conn.commit()
    finally:
        conn.close()

    return added


def query_vector_store(query: str, top_k: int = 8) -> list[str]:
    """
    Return the top-k most semantically relevant chunks for *query*.
    Uses cosine distance (`<=>`) via pgvector's HNSW index.
    """
    total = count()
    if total == 0:
        return []

    query_embedding = generate_embedding(query)
    vec_str = _vec_literal(query_embedding)

    conn = _get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT content
                FROM document_embeddings
                ORDER BY embedding <=> %s::vector
                LIMIT %s
                """,
                (vec_str, min(top_k, total)),
            )
            rows = cur.fetchall()
    finally:
        conn.close()

    return [row[0] for row in rows]


def wipe_collection() -> int:
    """Delete ALL documents. Returns the count that was removed."""
    conn = _get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM document_embeddings")
            n = cur.fetchone()[0]
            cur.execute("DELETE FROM document_embeddings")
        conn.commit()
    finally:
        conn.close()
    return n


def clear_collection():
    """Legacy alias for backward compatibility."""
    wipe_collection()
