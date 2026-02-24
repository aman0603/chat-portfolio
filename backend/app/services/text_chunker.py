import re


def _split_into_sentences(text: str) -> list[str]:
    """Split text into sentences using regex-based heuristics."""
    # Split on sentence-ending punctuation followed by space or newline
    sentence_endings = re.split(r'(?<=[.!?])\s+', text)
    # Also split on double newlines (section breaks in resumes)
    sentences: list[str] = []
    for segment in sentence_endings:
        parts = segment.split("\n\n")
        for part in parts:
            stripped = part.strip()
            if stripped:
                sentences.append(stripped)
    return sentences


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks using sentence-aware boundaries.

    Instead of splitting mid-word/sentence, this accumulates full sentences
    until the chunk_size limit is reached, then starts a new chunk with
    overlap from the previous one.
    """
    sentences = _split_into_sentences(text)

    if not sentences:
        return []

    chunks: list[str] = []
    current_chunk: list[str] = []
    current_length = 0

    for sentence in sentences:
        sentence_len = len(sentence)

        # If a single sentence exceeds chunk_size, add it as its own chunk
        if sentence_len > chunk_size:
            # Flush current chunk first
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
                current_length = 0
            chunks.append(sentence)
            continue

        # If adding this sentence would exceed the limit, flush the chunk
        if current_length + sentence_len + 1 > chunk_size and current_chunk:
            chunk_text_str = " ".join(current_chunk)
            chunks.append(chunk_text_str)

            # Calculate overlap: keep trailing sentences that fit within overlap size
            overlap_chunk: list[str] = []
            overlap_length = 0
            for s in reversed(current_chunk):
                if overlap_length + len(s) + 1 <= overlap:
                    overlap_chunk.insert(0, s)
                    overlap_length += len(s) + 1
                else:
                    break

            current_chunk = overlap_chunk
            current_length = overlap_length

        current_chunk.append(sentence)
        current_length += sentence_len + 1  # +1 for space

    # Don't forget the last chunk
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks