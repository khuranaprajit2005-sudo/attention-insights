interface Props {
  emoji?: string;
  label: string;
  note?: string;
  value: number;
  suffix?: string;
  showBar?: boolean;
}

export function SignalCard({ emoji, label, note, value, suffix = "", showBar = true }: Props) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="card-surface card-lift p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">
          {emoji ? <span aria-hidden>{emoji} </span> : null}
          {label}
        </p>
        <span className="font-display text-base font-semibold tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      {note ? <p className="mt-1 text-xs leading-snug text-muted-foreground">{note}</p> : null}
      {showBar ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="bg-brand h-full rounded-full"
            style={{ width: `${width}%`, transition: "width 900ms cubic-bezier(0.22,1,0.36,1)" }}
          />
        </div>
      ) : null}
    </div>
  );
}
