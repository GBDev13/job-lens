from pathlib import Path

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .analyzer import analyze_job_description
from .schemas import AnalysisResult, AnalyzeRequest

STATIC_DIR = Path(__file__).parent / "static"

app = FastAPI(
    title="Job Lens",
    description="Evaluate job descriptions with AI: red flags and suggested fixes",
    version="0.1.0",
)


@app.post("/api/analyze", response_model=AnalysisResult)
def analyze(request: AnalyzeRequest) -> AnalysisResult:
    try:
        return analyze_job_description(request.job_description)
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=500, detail="Anthropic API key is missing or invalid")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=503, detail="AI provider rate limit reached, try again shortly")
    except anthropic.APIStatusError as e:
        raise HTTPException(status_code=502, detail=f"AI provider error: {e.message}")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
