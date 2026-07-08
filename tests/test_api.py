from unittest.mock import patch

from fastapi.testclient import TestClient

from job_lens.main import app
from job_lens.schemas import AnalysisResult, Category, RedFlag, Severity

client = TestClient(app)

SAMPLE_JD = (
    "We are looking for a rockstar ninja developer to join our family. "
    "Must thrive in a fast-paced environment and wear many hats. "
    "Competitive salary. React, Node, AWS, Kubernetes, ML experience required. Junior role."
)

FAKE_RESULT = AnalysisResult(
    overall_score=35,
    summary="This posting has several culture and expectation red flags.",
    red_flags=[
        RedFlag(
            category=Category.culture,
            severity=Severity.high,
            quote="join our family",
            explanation="Family framing often signals blurred boundaries and guilt-driven overtime.",
            suggested_fix="Describe the team structure and collaboration style instead.",
        )
    ],
)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_index_serves_ui():
    response = client.get("/")
    assert response.status_code == 200
    assert "Job Lens" in response.text


def test_analyze_returns_structured_result():
    with patch("job_lens.main.analyze_job_description", return_value=FAKE_RESULT) as mock:
        response = client.post("/api/analyze", json={"job_description": SAMPLE_JD})

    assert response.status_code == 200
    mock.assert_called_once_with(SAMPLE_JD)
    body = response.json()
    assert body["overall_score"] == 35
    assert len(body["red_flags"]) == 1
    assert body["red_flags"][0]["severity"] == "high"
    assert body["red_flags"][0]["category"] == "culture"


def test_analyze_rejects_short_input():
    response = client.post("/api/analyze", json={"job_description": "too short"})
    assert response.status_code == 422


def test_analyze_rejects_missing_body():
    response = client.post("/api/analyze", json={})
    assert response.status_code == 422
