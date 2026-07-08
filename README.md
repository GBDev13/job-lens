# Job Lens 🔍

Evaluate job descriptions with AI. Paste a posting and get:

- An overall quality score (0–100)
- A list of **red flags** (culture, compensation, workload, vagueness, discrimination, unrealistic expectations) with severity and the exact quote that triggered them
- A **suggested fix** for each red flag

Built with Python, FastAPI, and the Anthropic API (structured outputs via Pydantic).

## Stack

| Layer | Tech |
|---|---|
| Language | Python 3.13 |
| Package manager | [uv](https://docs.astral.sh/uv/) |
| API | FastAPI + Uvicorn |
| AI | Anthropic Claude (structured JSON output) |
| Validation | Pydantic v2 |
| Tests | pytest + FastAPI TestClient |
| Frontend | React + TypeScript + Vite + Tailwind CSS v4 |

## Setup

Requires [uv](https://docs.astral.sh/uv/getting-started/installation/), Node 20+, and an Anthropic API key.

```bash
uv sync
cp .env.example .env   # then edit .env and paste your key
```

The key is read from a git-ignored `.env` file (loaded automatically at startup),
so you do not need to export it each session. An environment variable also works
if you prefer: `export ANTHROPIC_API_KEY="sk-ant-..."`.

## Run

The built frontend is committed under `src/job_lens/static/dist`, so the backend alone is enough:

```bash
uv run uvicorn job_lens.main:app --reload
```

Open http://localhost:8000 for the UI, or http://localhost:8000/docs for the interactive API docs (Swagger).

### Frontend development

For hot reload while working on the UI, run the Vite dev server alongside the backend (it proxies `/api` to port 8000):

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173. To ship UI changes, rebuild the bundle:

```bash
npm run build
```

## API

```
POST /api/analyze
{ "job_description": "<full text of the posting>" }
```

Response:

```json
{
  "overall_score": 42,
  "summary": "…",
  "red_flags": [
    {
      "category": "culture",
      "severity": "high",
      "quote": "we're a family",
      "explanation": "…",
      "suggested_fix": "…"
    }
  ]
}
```

## Examples

The [`examples/`](examples/) folder has three sample job descriptions (a toxic
one, an average one, and a strong one) with the expected score range and red
flags for each. See [`examples/README.md`](examples/README.md) for how to run them.

## Tests

```bash
uv run pytest
```

Tests mock the AI call, so no API key is needed to run them.

## How it works

1. The frontend posts the job description to `/api/analyze`.
2. `analyzer.py` sends it to Claude with a recruitment-expert system prompt and a Pydantic schema (`AnalysisResult`) as the required output format.
3. The API guarantees the response matches the schema, so the backend returns it directly, with no parsing or retry logic needed.
