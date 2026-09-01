interface Props {
  progress: number;
  steps: { label: string; done: boolean }[];
}

export function AnalysisProgress({ progress, steps }: Props) {
  return (
    <div className="card-surface space-y-5 p-6">
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Preparing your analysis...</span>
          <span className="font-display font-bold">{progress}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="bg-brand h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3 text-sm">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                step.done ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {step.done ? "✓" : "•"}
            </span>
            <span className={step.done ? "text-foreground" : "text-muted-foreground"}>
              {step.label}
            </span>
            {!step.done ? (
              <span className="ml-auto size-2 animate-pulse rounded-full bg-primary" />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
