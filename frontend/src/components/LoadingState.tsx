import { useEffect, useState } from "react";

const STEPS = [
  "Reading the job description…",
  "Checking compensation transparency…",
  "Scanning for culture red flags…",
  "Evaluating workload signals…",
  "Drafting suggested fixes…",
];

export function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fade-up mt-10 rounded-xl border border-line bg-panel p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-ping rounded-full bg-accent" />
        <p className="text-sm text-ink-2" aria-live="polite">
          {STEPS[step]}
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <div className="h-28 w-28 animate-pulse rounded-full bg-panel-2" />
          <div className="flex-1 space-y-2.5">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-panel-2" />
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-panel-2" />
          </div>
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-panel-2" />
        ))}
      </div>
    </div>
  );
}
