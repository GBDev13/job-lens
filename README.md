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
| Frontend | Single static HTML page (no build step) |

## Setup

Requires [uv](https://docs.astral.sh/uv/getting-started/installation/) and an Anthropic API key.

```bash
uv sync
export ANTHROPIC_API_KEY="sk-ant-..."
```

## Run

```bash
uv run uvicorn job_lens.main:app --reload
```

Open http://localhost:8000 for the UI, or http://localhost:8000/docs for the interactive API docs (Swagger).

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

## Tests

```bash
uv run pytest
```

Tests mock the AI call, so no API key is needed to run them.

## How it works

1. The frontend posts the job description to `/api/analyze`.
2. `analyzer.py` sends it to Claude with a recruitment-expert system prompt and a Pydantic schema (`AnalysisResult`) as the required output format.
3. The API guarantees the response matches the schema, so the backend returns it directly — no parsing or retry logic needed.
