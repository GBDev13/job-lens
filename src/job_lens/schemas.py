from enum import Enum

from pydantic import BaseModel, Field


class Severity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Category(str, Enum):
    compensation = "compensation"
    culture = "culture"
    workload = "workload"
    vagueness = "vagueness"
    discrimination = "discrimination"
    unrealistic_expectations = "unrealistic_expectations"
    legal = "legal"
    other = "other"


class RedFlag(BaseModel):
    category: Category
    severity: Severity
    quote: str = Field(description="The exact excerpt from the job description that triggered this flag")
    explanation: str = Field(description="Why this is a red flag for candidates")
    suggested_fix: str = Field(description="Concrete rewrite or change that would resolve the issue")


class AnalysisResult(BaseModel):
    overall_score: int = Field(ge=0, le=100, description="Overall quality score, 100 = excellent posting")
    summary: str = Field(description="Two or three sentence overall assessment of the posting")
    red_flags: list[RedFlag]


class AnalyzeRequest(BaseModel):
    job_description: str = Field(min_length=50, max_length=50_000)
