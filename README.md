# Gativ — AI-Native Engineering Readiness & Proof-of-Work Engine

> **Gativ** is an AI-powered platform that converts candidate GitHub profiles into an objective **360° Readiness Index** and **48-Hour Proof-of-Work Sprint Plans**. By inspecting ground-truth repository signals (manifest files, test suites, Dockerfiles, architecture patterns) and validating live Pull Requests via the GitHub REST API, Gativ eliminates hiring guesswork and issues recruiter-verified proof badges.

---

## 🚀 Core Workflow

```
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│  1. GitHub Signal         │  ─► │  2. AI Role Gap           │  ─► │  3. Curated Resume        │  ─► │  4. 48-Hour Sprint &      │
│     Harvesting            │     │     Audit Analysis        │     │     Portfolio Projects    │     │     Live PR Verification  │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
```

1. **GitHub Signal Harvesting**: 1-click GitHub OAuth connection automatically inspects public user repositories, manifest dependencies (`requirements.txt`, `go.mod`, `package.json`), PyTest/GoTest suites, Dockerfiles, and architectural patterns via async `httpx`.
2. **AI Role Gap Audit**: Google Gemini LLM evaluates harvested code signals against specific position benchmarks (Backend Go, Backend Python, Frontend React/Next) calibrated for High-Growth Startups or Big Tech Enterprises to calculate an unbiased 0-100 Readiness Index.
3. **Curated Resume Portfolio Projects**: Recommends enterprise-grade system microservice ideas directly targeting detected gaps to replace generic tutorial CRUDs with high-impact systems recruiters seek.
4. **48-Hour Sprints & Live PR Verification**: Candidates execute structured milestone checkpoints, submit GitHub Pull Request URLs, and receive real-time score recalculation upon automated GitHub REST API PR verification.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) & React 18
- **Language**: TypeScript
- **Styling & Aesthetics**: Tailwind CSS v3 with Linear/Vercel modern aesthetic
- **Theme Support**: `next-themes` (Class-mode dark and light theme toggle with zero hydration flashes)
- **Icons**: Lucide React
- **Authentication**: Firebase Auth (GitHub OAuth Provider)

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Validation & Settings**: Pydantic v2 & Pydantic Settings
- **Async HTTP & Scraping**: `httpx` (Concurrent GitHub REST API signal harvester)
- **LLM Engine**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`)
- **Testing**: PyTest & FastAPI `TestClient`

### Infrastructure & Database
- **Database & Auth**: Supabase Postgres & Firebase Auth
- **Deployment**: Vercel (Frontend) & Render (Backend Service)

---

## ⚙️ Local Setup Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and `npm`
- Google Gemini API Key ([Get a free key](https://aistudio.google.com/))

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
ENVIRONMENT=development
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the FastAPI backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
*API interactive documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

Run the backend verification test suite:
```bash
python test_api.py
```

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Create local environment configuration
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-id
```

Run the development server:
```bash
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

To verify production frontend build:
```bash
npm run build
```

---

## 🚢 Deployment Overview

### Frontend (Vercel)
- Configured via `frontend/vercel.json`.
- Set environment variable `NEXT_PUBLIC_API_URL` to your production backend URL.
- Deploy directly from GitHub repository via Vercel Dashboard or Vercel CLI (`vercel --prod`).

### Backend (Render)
- Configured via `backend/render.yaml`.
- Set environment variable `GEMINI_API_KEY` in Render environment configuration.
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`

---

## 📜 License & Compliance
Gativ strictly enforces data protection and read-only token scopes. GitHub OAuth tokens are used solely to read public repository structures and verify candidate Pull Requests.
