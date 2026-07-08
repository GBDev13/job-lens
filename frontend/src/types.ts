export type Severity = "low" | "medium" | "high";

export type Category =
  | "compensation"
  | "culture"
  | "workload"
  | "vagueness"
  | "discrimination"
  | "unrealistic_expectations"
  | "legal"
  | "other";

export interface RedFlag {
  category: Category;
  severity: Severity;
  quote: string;
  explanation: string;
  suggested_fix: string;
}

export interface AnalysisResult {
  overall_score: number;
  summary: string;
  red_flags: RedFlag[];
}
