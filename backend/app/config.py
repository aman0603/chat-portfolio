import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str = "arcee-ai/trinity-large-preview:free"
    DATABASE_URL: str

    # Rate limiting
    RATE_LIMIT_MAX_REQUESTS: int = Field(default=20, description="Max requests per window")
    RATE_LIMIT_WINDOW_SECONDS: int = Field(default=60, description="Rate limit window in seconds")

    # RAG settings
    CHUNK_SIZE: int = Field(default=300, description="Text chunk size for embeddings")
    CHUNK_OVERLAP: int = Field(default=50, description="Overlap between chunks")
    TOP_K_RESULTS: int = Field(default=8, description="Number of top results from vector search")
    MAX_CHAT_HISTORY: int = Field(default=10, description="Max chat history messages to include in context")

    # Message constraints
    MAX_MESSAGE_LENGTH: int = Field(default=1000, description="Max length of user message")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()