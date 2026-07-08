import { useMemo, useRef, useState } from "react";
import { analyzeJobDescription } from "./api";
import { SAMPLE_JD } from "./sample";
import type { AnalysisResult, Severity } from "./types";
import { ScoreRing } from "./components/ScoreRing";
import { FlagCard } from "./components/FlagCard";
import { LoadingState } from "./components/LoadingState";

const MIN_LENGTH = 50;
type Filter = "all" | Severity;

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const resultsRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c = { high: 0, medium: 0, low: 0 };
    for (const f of result?.red_flags ?? []) c[f.severity]++;
    return c;
  }, [result]);

  const visibleFlags = useMemo(
    () =>
      (result?.red_flags ?? []).filter(
        (f) => filter === "all" || f.severity === filter,
      ),
    [result, filter],
  );

  async function analyze() {
    const jd = text.trim();
    if (jd.length < MIN_LENGTH) {
      setError(`Paste a job description of at least ${MIN_LENGTH} characters.`);
      return;
    }
    setError(null);
    setResult(null);
    setFilter("all");
    setLoading(true);
    try {
      const data = await analyzeJobDescription(jd);
      setResult(data);
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      analyze();
    }
  }

  const tooShort = text.trim().length > 0 && text.trim().length < MIN_LENGTH;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-14 text-ink">
      <header className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Job Lens
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Is this job posting hiding something?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-2">
          Paste a job description and get AI-detected red flags, each with a
          concrete suggestion on how to fix it.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-panel p-5 shadow-xl shadow-black/20">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Paste the full job description here..."
          rows={11}
          className="w-full resize-y rounded-xl border border-line bg-panel-2 p-4 text-sm leading-relaxed text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-ink-3">
            <span className={tooShort ? "text-warn" : ""}>
              {text.trim().length} characters
              {tooShort ? ` (min ${MIN_LENGTH})` : ""}
            </span>
            <button
              onClick={() => setText(SAMPLE_JD)}
              className="text-accent underline-offset-2 hover:underline"
            >
              Try a sample posting
            </button>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="hidden rounded-md border border-line bg-panel-2 px-2 py-1 text-[11px] text-ink-3 sm:inline">
              ⌘ + Enter
            </kbd>
            <button
              onClick={analyze}
              disabled={loading}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-[#0b0e14] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="fade-up mt-6 rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad"
        >
          {error}
        </div>
      )}

      {loading && <LoadingState />}

      {result && (
        <div ref={resultsRef} className="mt-12 scroll-mt-6">
          <section className="fade-up flex flex-col items-center gap-6 rounded-2xl border border-line bg-panel p-7 sm:flex-row sm:gap-8">
            <ScoreRing score={result.overall_score} />
            <div className="text-center sm:text-left">
              <h2 className="mb-2 text-lg font-semibold">Overall assessment</h2>
              <p className="text-sm leading-relaxed text-ink-2">{result.summary}</p>
            </div>
          </section>

          {result.red_flags.length === 0 ? (
            <div className="fade-up mt-8 rounded-2xl border border-good/25 bg-good/5 p-8 text-center">
              <p className="text-2xl">✅</p>
              <h2 className="mt-2 text-lg font-semibold text-good">
                No red flags found
              </h2>
              <p className="mt-1 text-sm text-ink-2">
                This posting is clear, fair, and candidate-friendly.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  Red flags{" "}
                  <span className="text-ink-3">({result.red_flags.length})</span>
                </h2>
                <div className="flex gap-1.5" role="tablist" aria-label="Filter by severity">
                  {(
                    [
                      ["all", result.red_flags.length],
                      ["high", counts.high],
                      ["medium", counts.medium],
                      ["low", counts.low],
                    ] as [Filter, number][]
                  ).map(([key, count]) => (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={filter === key}
                      disabled={count === 0}
                      onClick={() => setFilter(key)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition disabled:opacity-30 ${
                        filter === key
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-line text-ink-2 hover:border-ink-3"
                      }`}
                    >
                      {key} {count > 0 && <span className="opacity-60">{count}</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {visibleFlags.map((flag, i) => (
                  <FlagCard key={`${flag.quote}-${i}`} flag={flag} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <footer className="mt-20 text-center text-xs text-ink-3">
        Built with FastAPI, Anthropic Claude, React, and Tailwind CSS
      </footer>
    </div>
  );
}
