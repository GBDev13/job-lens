import { useState } from "react";
import type { RedFlag, Severity } from "../types";

const SEVERITY_STYLES: Record<Severity, { border: string; badge: string; icon: string }> = {
  high: { border: "border-l-bad", badge: "bg-bad/15 text-bad", icon: "▲" },
  medium: { border: "border-l-warn", badge: "bg-warn/15 text-warn", icon: "◆" },
  low: { border: "border-l-good", badge: "bg-good/15 text-good", icon: "●" },
};

const CATEGORY_LABELS: Record<string, string> = {
  compensation: "Compensation",
  culture: "Culture",
  workload: "Workload",
  vagueness: "Vagueness",
  discrimination: "Discrimination",
  unrealistic_expectations: "Unrealistic expectations",
  legal: "Legal",
  other: "Other",
};

export function FlagCard({ flag, index }: { flag: RedFlag; index: number }) {
  const [copied, setCopied] = useState(false);
  const style = SEVERITY_STYLES[flag.severity];

  async function copyFix() {
    await navigator.clipboard.writeText(flag.suggested_fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article
      className={`fade-up rounded-xl border border-line ${style.border} border-l-4 bg-panel p-5`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${style.badge}`}
        >
          <span aria-hidden>{style.icon}</span>
          {flag.severity}
        </span>
        <span className="text-sm text-ink-2">
          {CATEGORY_LABELS[flag.category] ?? flag.category}
        </span>
      </header>

      <blockquote className="mb-3 rounded-lg bg-panel-2 px-4 py-2.5 text-sm italic text-ink-2 border border-line/60">
        “{flag.quote}”
      </blockquote>

      <p className="mb-4 text-sm leading-relaxed text-ink">{flag.explanation}</p>

      <div className="rounded-lg border border-good/20 bg-good/5 p-3.5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-good">
            Suggested fix
          </span>
          <button
            onClick={copyFix}
            className="rounded-md border border-line px-2 py-0.5 text-xs text-ink-2 transition hover:border-good/40 hover:text-good"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-ink">{flag.suggested_fix}</p>
      </div>
    </article>
  );
}
