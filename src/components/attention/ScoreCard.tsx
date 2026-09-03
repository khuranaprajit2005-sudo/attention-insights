interface Props {
  score: number;
  label: string;
  handle: string;
  caption?: string;
}

export function ScoreCard({ score, label, handle, caption }: Props) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="card-surface bg-warm rise-in flex flex-col items-center gap-3 p-7 text-center">
      <p className="eyebrow">Attention score</p>
      <div className="relative size-44">
        <svg viewBox="0 0 160 160" className="size-full -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent-foreground)" />
            </linearGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="color-mix(in oklab, var(--foreground) 10%, transparent)"
            strokeWidth="9"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: "stroke-dasharray 1100ms cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <span className="font-display text-[3.1rem] font-semibold leading-none">{score}</span>
            <span className="ml-0.5 text-sm text-muted-foreground">/100</span>
          </div>
        </div>
      </div>
      <p className="font-display text-lg font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">{caption ?? `Reading for ${handle}`}</p>
    </div>
  );
}
