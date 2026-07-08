const SIZE = 132;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreTier(score: number) {
  if (score >= 75) return { color: "var(--color-good)", label: "Looks healthy" };
  if (score >= 45) return { color: "var(--color-warn)", label: "Needs work" };
  return { color: "var(--color-bad)", label: "Serious issues" };
}

export function ScoreRing({ score }: { score: number }) {
  const tier = scoreTier(score);
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} role="img" aria-label={`Score ${score} out of 100`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={STROKE}
          />
          <circle
            className="ring-arc"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={tier.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ "--ring-circumference": `${CIRCUMFERENCE}px` } as React.CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-ink">{score}</span>
          <span className="text-xs text-ink-2">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-ink-2">{tier.label}</span>
    </div>
  );
}
