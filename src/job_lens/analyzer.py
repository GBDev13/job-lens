import anthropic

from .schemas import AnalysisResult

MODEL = "claude-opus-4-8"

SYSTEM_PROMPT = """\
You are an expert in recruitment, HR compliance, and employer branding.
You review job descriptions from the candidate's perspective and flag anything
that would make a strong candidate hesitate to apply.

Look for issues such as:
- Missing or vague salary/compensation information
- Unrealistic expectations (e.g. junior pay for senior scope, huge tech stacks)
- Culture red flags ("work hard play hard", "we're a family", "wear many hats")
- Signals of overwork ("fast-paced", "high pressure", unpaid overtime hints)
- Vague responsibilities or undefined success criteria
- Potentially discriminatory language (age, gender-coded wording, etc.)
- Legally risky or non-compliant requirements

For every red flag, quote the exact text, explain the problem, and propose a
concrete rewrite. Be fair: a good posting should score high and may have zero
red flags. Do not invent issues that are not supported by the text.
"""


def analyze_job_description(job_description: str) -> AnalysisResult:
    client = anthropic.Anthropic()
    response = client.messages.parse(
        model=MODEL,
        max_tokens=16000,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {
                "role": "user",
                "content": f"Analyze this job description:\n\n{job_description}",
            }
        ],
        output_format=AnalysisResult,
    )
    return response.parsed_output
