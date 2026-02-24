"""
Ingest portfolio_data.txt into the vector store.
Run this whenever the portfolio data file is updated.

Usage:
    python -m app.load_portfolio_data
"""

import sys
from app.services.text_chunker import chunk_text
from app.services.vector_store import add_documents, wipe_collection, count as vs_count
from app.config import settings

DATA_PATH = "app/data/portfolio_data.txt"


def main():
    print("─" * 50)
    print("📋 Portfolio RAG — Text Data Ingestion")
    print("─" * 50)

    # 1. Load text file
    print(f"\n[1/3] Loading data from: {DATA_PATH}")
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print(f"  ✗ File not found: {DATA_PATH}")
        sys.exit(1)
    print(f"  ✓ Loaded {len(text):,} characters")

    # 2. Chunk text
    print(f"\n[2/3] Chunking (chunk_size={settings.CHUNK_SIZE}, overlap={settings.CHUNK_OVERLAP})")
    chunks = chunk_text(text, chunk_size=settings.CHUNK_SIZE, overlap=settings.CHUNK_OVERLAP)
    print(f"  ✓ Created {len(chunks)} chunks")
    for i, chunk in enumerate(chunks[:3]):
        preview = chunk[:80].replace("\n", " ")
        print(f"    chunk[{i}]: \"{preview}…\"")
    if len(chunks) > 3:
        print(f"    … and {len(chunks) - 3} more")

    # 3. Wipe old chunks (safe — keeps collection reference valid) then re-add
    print(f"\n[3/3] Wiping old chunks and storing {len(chunks)} new chunks…")
    removed = wipe_collection()
    print(f"  ✓ Removed {removed} old chunks")
    added = add_documents(chunks)
    print(f"  ✓ Added {added} chunks")
    print(f"  ✓ Total documents in collection: {vs_count()}")

    print("\n" + "─" * 50)
    print("✅ Portfolio data ingested successfully!")
    print("─" * 50)


if __name__ == "__main__":
    main()
