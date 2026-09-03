export function LockedCard({ rank, hint }: { rank?: number; hint?: string }) {
  return (
    <div
      className="card-surface relative flex items-center gap-3.5 overflow-hidden p-4"
      aria-label={`Locked attention signal${rank ? ` number ${rank}` : ""}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-card to-transparent opacity-60 shimmer-sweep"
      />
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-sm"
      >
        🔒
      </span>
      <div className="min-w-0 flex-1">
        <p aria-hidden className="select-none truncate font-medium blur-[7px]">
          ███████████
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {hint ?? "Locked until you unlock the report."}
        </p>
      </div>
      <span aria-hidden className="select-none font-display text-lg font-semibold blur-[6px]">
        ••
      </span>
    </div>
  );
}
