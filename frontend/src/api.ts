import type { AnalysisResult } from "./types";

export async function analyzeJobDescription(
  jobDescription: string,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescription }),
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail =
      typeof body?.detail === "string"
        ? body.detail
        : `Request failed with status ${res.status}`;
    throw new Error(detail);
  }

  return res.json();
}
