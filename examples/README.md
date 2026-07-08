# Examples

Three sample job descriptions covering the quality range, with the results a good
analysis should produce.

The AI output is not word-for-word deterministic, so treat the scores and flag
counts below as expected ranges, not exact values. The categories and severities,
though, should come out close to this every time.

## How to run them

With the server running (`uv run uvicorn job_lens.main:app`), pipe a file into the API:

```bash
curl -s -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  --arg-file examples/01-toxic-startup.txt
```

`curl` has no `--arg-file` for JSON bodies, so use `jq` to build the payload:

```bash
jq -Rs '{job_description: .}' examples/01-toxic-startup.txt \
  | curl -s -X POST http://localhost:8000/api/analyze \
      -H "Content-Type: application/json" -d @-
```

Or just paste the file contents into the web UI at http://localhost:8000.

---

## 01-toxic-startup.txt

A posting stuffed with warning signs.

- **Expected score:** roughly 10 to 30 (serious issues)
- **Expected red flags:** many, several `high` severity
- **Key issues an analysis should catch:**
  - `culture` - "join our family", "work hard play hard", "no 9-to-5 mentality" signal blurred boundaries and overwork
  - `workload` - "wear many hats", evening/weekend pushes, "other duties as assigned" point to scope creep and unpaid overtime
  - `unrealistic_expectations` - "10+ years of React" senior bar contradicting "recent graduate energy"; one person owning a huge stack (React, Angular, Vue, Node, Python, Go, K8s, ML, mobile)
  - `compensation` - "Competitive salary (DOE)" with no number; vague future equity
  - `discrimination` - "young and hungry", "recent graduate energy" is age-coded language

## 02-average-posting.txt

A normal, decent posting with a couple of soft spots.

- **Expected score:** roughly 55 to 75 (needs some work)
- **Expected red flags:** a few, mostly `low` to `medium`
- **Key issues an analysis should catch:**
  - `workload` - on-call rotation is mentioned with no detail on frequency or compensation
  - `vagueness` - responsibilities are broad ("help improve reliability") without concrete success criteria
  - Note: salary range is present and specific, which should lift the score

## 03-strong-posting.txt

A candidate-friendly, transparent posting.

- **Expected score:** roughly 85 to 100 (looks healthy)
- **Expected red flags:** zero, or one minor `low`
- **Why it scores well:**
  - Transparent salary band and leveling framework
  - Explicit boundaries on working hours and meetings
  - Clear, bounded hiring process with a paid take-home policy
  - Inclusive language ("you do not need to match every point")
  - Concrete, generous benefits
