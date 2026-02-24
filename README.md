# Portfolio RAG Chatbot

> **Live portfolio assistant** — Aman Paswan's AI-powered portfolio website that answers questions about his skills, experience, and projects in real-time using Retrieval-Augmented Generation (RAG).

---

## ✨ Features

- 🤖 **RAG Chatbot** — answers questions about Aman using embeddings + vector search
- ⚡ **SSE Streaming** — responses stream token-by-token like ChatGPT
- 🧠 **pgvector on Supabase** — cloud-native, persistent vector embeddings
- 🎨 **3D Hero** — Three.js torus knot + animated background
- 🌗 **Light / Dark mode** — persisted in localStorage
- 📱 **Fully responsive** — Tailwind CSS + Framer Motion animations
- 🔒 **Rate limiting** — per-IP request throttling
- 💬 **Session memory** — multi-turn conversation support

---

## 🏗️ Architecture

```
portfolio/
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── api/                  # /api/chat, /api/chat/stream (SSE)
│   │   ├── services/
│   │   │   ├── rag_pipeline.py   # builds grounded LLM messages
│   │   │   ├── vector_store.py   # pgvector add/query via psycopg2
│   │   │   └── embeddings.py     # sentence-transformers all-MiniLM-L6-v2
│   │   ├── data/
│   │   │   └── portfolio_data.txt  # edit this to update the bot
│   │   ├── main.py
│   │   └── config.py
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
│
└── frontend/                     # Vite + React + TypeScript
    ├── src/
    │   ├── context/              # ChatContext (SSE streaming), ThemeContext
    │   └── components/           # Hero, HeroChat, HeroScene (Three.js), ...
    └── .env.local.example

Supabase (PostgreSQL + pgvector)
└── document_embeddings   # chunk_id, content, embedding vector(384)
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- A [Supabase](https://supabase.com) project with `pgvector` extension enabled
- An [OpenRouter](https://openrouter.ai) API key

### 1. Clone the repo

```bash
git clone <repo-url>
cd portfolio
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
cp .env.example .env            # fill in your values
```

### 3. Set up Supabase

Enable pgvector in your Supabase SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS document_embeddings (
    id         SERIAL PRIMARY KEY,
    chunk_id   VARCHAR(64) UNIQUE NOT NULL,
    content    TEXT NOT NULL,
    embedding  vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_doc_emb_hnsw
    ON document_embeddings USING hnsw (embedding vector_cosine_ops);
```

### 4. Ingest portfolio data

```bash
# From the backend/ directory
python -m app.load_portfolio_data
```

### 5. Run backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Frontend setup

```bash
cd ../frontend
cp .env.local.example .env.local  # set VITE_API_URL if needed
npm install
npm run dev
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter key | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | LLM model slug | `arcee-ai/trinity-large-preview:free` |
| `DATABASE_URL` | Supabase pooler connection string | `postgresql://postgres:...@aws-0-....pooler.supabase.com:5432/postgres` |
| `FRONTEND_URL` | Deployed frontend URL for CORS | `https://your-portfolio.vercel.app` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL (no trailing slash) | `https://your-backend.railway.app` |

> **Local dev:** `VITE_API_URL` defaults to `http://localhost:8000` if unset.

---

## 🌍 Deployment

### Backend — [Railway](https://railway.app) / [Render](https://render.com)

1. Connect your GitHub repo
2. Set **Root Directory** → `backend/`
3. Start command is auto-detected via `Procfile`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add env vars: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `DATABASE_URL`, `FRONTEND_URL`

### Frontend — [Vercel](https://vercel.com)

1. Connect your GitHub repo
2. **Root Directory** → leave as `.` (repo root) — `vercel.json` handles the build
3. Add env var: `VITE_API_URL=https://your-deployed-backend-url`

---

## 🧩 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js |
| Backend | FastAPI, Python 3.11, pydantic-settings |
| AI / RAG | sentence-transformers (all-MiniLM-L6-v2), OpenRouter LLM, pgvector |
| Database | Supabase PostgreSQL (pgvector), SQLAlchemy (chat history) |
| Infra | Vercel (frontend), Railway/Render (backend), Supabase (DB) |

---

## 📄 License

MIT — feel free to fork and adapt for your own portfolio!
