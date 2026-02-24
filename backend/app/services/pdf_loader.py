import re
from pypdf import PdfReader


def _fix_spaced_chars(text: str) -> str:
    """
    Fix PDF font-encoding artefact where each character is extracted with a
    space between it, e.g. 'N a x c u r e' → 'Naxcure'.
    """
    pattern = re.compile(
        r'(?<!\w)'
        r'([A-Za-z0-9])'
        r'(?: ([A-Za-z0-9]))'
        r'(?: ([A-Za-z0-9]))+'
        r'(?!\w)'
    )

    def _collapse(m: re.Match) -> str:
        return m.group(0).replace(' ', '')

    prev = None
    while prev != text:
        prev = text
        text = pattern.sub(_collapse, text)

    return text


def _clean_pdf_symbols(text: str) -> str:
    """
    Remove PDF icon/glyph artefacts that result from FontAwesome or similar
    symbol fonts being extracted as garbage sequences like:
      /envel⌢pe  ♂¶obile-alt  /linkedin  /github  etc.
    Also strips control characters and normalises whitespace.
    """
    # Remove common PDF-icon prefixes left by font extraction
    text = re.sub(r'/[a-z][a-z0-9\-]+\b', '', text, flags=re.IGNORECASE)  # /envelope /linkedin /github etc.
    # Remove stray Unicode symbols/private-use chars from icon fonts
    text = re.sub(r'[^\x00-\x7F\u00A0-\u024F\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026\u20B9]', '', text)
    # Remove leftover glyph fragments like ⌢ ♂ ¶ and other misc symbols
    text = re.sub(r'[⌢♂¶▪◦●◆■□▶►]', '', text)
    # Strip icon-font residue patterns like "mobile-alt" or "alt" on their own after stripping prefix
    text = re.sub(r'\b(mobile-alt|envelope|alt)\b', '', text, flags=re.IGNORECASE)
    # Collapse multiple spaces that are now left over
    text = re.sub(r' {2,}', ' ', text)
    # Remove lines that are purely whitespace or have only a few noise characters
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        # Keep the line only if it has at least 2 real alphanumeric characters
        if len(re.sub(r'[^A-Za-z0-9]', '', stripped)) >= 2:
            cleaned_lines.append(stripped)
        elif stripped == '':
            cleaned_lines.append('')  # preserve blank lines for paragraph separation
    # Collapse runs of 3+ blank lines into double newline
    text = '\n'.join(cleaned_lines)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract and clean text from a PDF file."""
    try:
        reader = PdfReader(pdf_path)
    except FileNotFoundError:
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
    except Exception as e:
        raise RuntimeError(f"Failed to read PDF: {e}")

    if len(reader.pages) == 0:
        raise ValueError("PDF has no pages.")

    text_parts: list[str] = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            cleaned = page_text.strip()
            cleaned = _fix_spaced_chars(cleaned)      # 1. collapse spaced-out chars first
            cleaned = _clean_pdf_symbols(cleaned)     # 2. strip icon/glyph artefacts
            if cleaned:
                text_parts.append(cleaned)

    if not text_parts:
        raise ValueError("No text could be extracted from the PDF.")

    return "\n\n".join(text_parts)
