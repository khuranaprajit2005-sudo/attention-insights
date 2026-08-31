interface Props {
  score: number;
  label: string;
  emoji: string;
  handle: string;
}

export function ScoreCard({ score, label, emoji, handle }: Props) {
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="card-surface flex flex-col items-center gap-3 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Your attention score
      </p>
      <div className="relative size-40">
        <svg viewBox="0 0 160 160" className="size-full -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.68 0.24 12)" />
              <stop offset="100%" stopColor="oklch(0.8 0.17 72)" />
            </linearGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: "stroke-dasharray 900ms ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span className="font-display text-4xl font-bold">{score}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>
      </div>
      <p className="font-display text-lg font-bold">
        {emoji} {label}
      </p>
      <p className="text-xs text-muted-foreground">Demo analysis for {handle}</p>
    </div>
  );
}
