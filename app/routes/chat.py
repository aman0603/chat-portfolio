import logging
import time
from collections import defaultdict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ..database import SessionLocal
from ..models import ChatHistory
from ..services.rag_pipeline import build_messages
from ..services.openrouter import stream_openrouter
from ..config import settings
from sse_starlette.sse import EventSourceResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# ── Simple in-memory rate limiter ──────────────────────────────────────────
_rate_limit_store: dict[str, list[float]] = defaultdict(list)


def _check_rate_limit(session_id: str):
    """Raise 429 if the session has exceeded the rate limit."""
    now = time.time()
    window = settings.RATE_LIMIT_WINDOW_SECONDS
    max_requests = settings.RATE_LIMIT_MAX_REQUESTS

    # Prune timestamps outside the window
    _rate_limit_store[session_id] = [
        ts for ts in _rate_limit_store[session_id] if now - ts < window
    ]

    if len(_rate_limit_store[session_id]) >= max_requests:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Max {max_requests} requests per {window}s.",
        )

    _rate_limit_store[session_id].append(now)


# ── Request / Response schemas ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=100, description="Unique session ID")
    message: str = Field(..., min_length=1, description="User message")


# ── Chat endpoint ──────────────────────────────────────────────────────────
@router.post("/chat")
async def chat(request: ChatRequest):
    # Validate message length
    if len(request.message) > settings.MAX_MESSAGE_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Message too long. Max {settings.MAX_MESSAGE_LENGTH} characters.",
        )

    # Rate limit check
    _check_rate_limit(request.session_id)

    # Save user message to DB
    try:
        db = SessionLocal()
        db.add(ChatHistory(
            session_id=request.session_id,
            role="user",
            message=request.message,
        ))
        db.commit()

        # Load recent chat history for conversational memory
        history_rows = (
            db.query(ChatHistory)
            .filter(ChatHistory.session_id == request.session_id)
            .order_by(ChatHistory.created_at.asc())
            .limit(settings.MAX_CHAT_HISTORY)
            .all()
        )
        chat_history = [{"role": row.role, "message": row.message} for row in history_rows]
        db.close()
    except Exception as e:
        logger.error(f"Database error while saving user message: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

    # Build RAG-augmented messages
    try:
        messages = build_messages(request.message, chat_history=chat_history)
    except Exception as e:
        logger.error(f"Error building RAG messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to process your question.")

    # Stream response via SSE
    async def event_generator():
        full_response = ""

        try:
            async for token in stream_openrouter(messages):
                full_response += token
                yield {"data": token}
        except RuntimeError as e:
            # Friendly error from our openrouter wrapper
            yield {"data": str(e)}
            full_response = f"[Error] {e}"
        except Exception as e:
            logger.error(f"Unexpected streaming error: {e}")
            yield {"data": "Sorry, something went wrong. Please try again."}
            full_response = f"[Error] {e}"

        # Save assistant response in a NEW session (the Depends session is already closed)
        try:
            save_db = SessionLocal()
            save_db.add(ChatHistory(
                session_id=request.session_id,
                role="assistant",
                message=full_response,
            ))
            save_db.commit()
            save_db.close()
        except Exception as e:
            logger.error(f"Failed to save assistant response: {e}")

    return EventSourceResponse(event_generator())


# ── History endpoint ───────────────────────────────────────────────────────
@router.get("/history")
def get_history(session_id: str):
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required.")

    db = SessionLocal()
    try:
        chats = (
            db.query(ChatHistory)
            .filter(ChatHistory.session_id == session_id)
            .order_by(ChatHistory.created_at.asc())
            .all()
        )
        return [
            {
                "id": c.id,
                "role": c.role,
                "message": c.message,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in chats
        ]
    finally:
        db.close()