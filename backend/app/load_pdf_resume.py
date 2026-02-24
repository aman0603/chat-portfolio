"""
One-time script to ingest the PDF resume into the vector store.

Usage:
    python -m app.load_pdf_resume
"""

import sys
from app.services.pdf_loader import extract_text_from_pdf
from app.services.text_chunker import chunk_text
from app.services.vector_store import add_documents, count as vs_count
from app.config import settings

PDF_PATH = "app/data/Aman-Paswan-Resume.pdf"


def main():
    print(f"{'─' * 50}")
    print("📄 Portfolio RAG — PDF Ingestion")
    print(f"{'─' * 50}")

    # 1. Extract text
    print(f"\n[1/3] Extracting text from: {PDF_PATH}")
    try:
        text = extract_text_from_pdf(PDF_PATH)
    except (FileNotFoundError, ValueError, RuntimeError) as e:
        print(f"  ✗ Error: {e}")
        sys.exit(1)
    print(f"  ✓ Extracted {len(text):,} characters")

    # 2. Chunk text
    print(f"\n[2/3] Chunking text (chunk_size={settings.CHUNK_SIZE}, overlap={settings.CHUNK_OVERLAP})")
    chunks = chunk_text(text, chunk_size=settings.CHUNK_SIZE, overlap=settings.CHUNK_OVERLAP)
    print(f"  ✓ Created {len(chunks)} chunks")

    # Show chunk preview
    for i, chunk in enumerate(chunks[:3]):
        preview = chunk[:80].replace("\n", " ")
        print(f"    chunk[{i}]: \"{preview}…\"")
    if len(chunks) > 3:
        print(f"    … and {len(chunks) - 3} more")

    # 3. Store in vector DB (with deduplication)
    print(f"\n[3/3] Storing in vector DB (existing: {vs_count()} docs)")
    added = add_documents(chunks)
    print(f"  ✓ Added {added} new chunks (skipped {len(chunks) - added} duplicates)")
    print(f"  ✓ Total documents in collection: {vs_count()}")

    print(f"\n{'─' * 50}")
    print("✅ PDF Resume ingested successfully!")
    print(f"{'─' * 50}")


if __name__ == "__main__":
    main()