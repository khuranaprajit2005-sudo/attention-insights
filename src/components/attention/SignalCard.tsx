interface Props {
  label: string;
  value: number;
  suffix?: string;
  showBar?: boolean;
}

export function SignalCard({ label, value, suffix = "/100", showBar = true }: Props) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-display text-base font-bold">
          {value}
          {suffix}
        </span>
      </div>
      {showBar ? (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="bg-brand h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
