import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine

logger = logging.getLogger(__name__)

# ── Configure logging ──────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-8s │ %(name)s │ %(message)s",
)


# ── Lifespan: runs on startup / shutdown ───────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Creating database tables (if not exists)…")
    Base.metadata.create_all(bind=engine)
    logger.info("Portfolio backend is ready ✓")
    yield
    # Shutdown
    logger.info("Shutting down…")


# ── FastAPI app ────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Portfolio Backend",
    description="RAG-powered chatbot for Aman Paswan's portfolio",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────
# In production: set FRONTEND_URL env var to your deployed frontend URL
# e.g. https://your-portfolio.vercel.app
_frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    _frontend_url,
    "http://localhost:5173",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ─────────────────────────────────────────────────────────────────
from .routes import chat  # noqa: E402

app.include_router(chat.router, prefix="/api", tags=["Chat"])


# ── Health check ───────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "service": "portfolio-rag-backend"}