import type { DemoAccount } from "@/lib/analysis/types";

function explain(score: number): string {
  if (score >= 80) return "Frequent, recent interaction signals.";
  if (score >= 60) return "Regular interaction with occasional gaps.";
  return "Occasional interaction, steady over time.";
}

export function AccountCard({ account, blurred = false }: { account: DemoAccount; blurred?: boolean }) {
  return (
    <div className="card-surface flex items-center gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <span
        aria-hidden
        className="bg-brand grid size-11 shrink-0 place-items-center rounded-full font-display text-base font-bold text-primary-foreground"
      >
        {account.handle.charAt(1).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${blurred ? "select-none blur-[6px]" : ""}`}>
          {account.handle}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {account.emoji} {account.label}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/80">{explain(account.score)}</p>
      </div>
      <div className="shrink-0 text-right">
        <span className="font-display text-lg font-bold">{account.score}</span>
        <span className="block text-[10px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
