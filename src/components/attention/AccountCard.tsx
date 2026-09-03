import type { DemoAccount } from "@/lib/analysis/types";

export function AccountCard({
  account,
  rank,
}: {
  account: DemoAccount;
  rank?: number;
}) {
  return (
    <div className="card-surface card-lift flex items-center gap-3.5 p-4">
      <span
        aria-hidden
        className="bg-warm grid size-11 shrink-0 place-items-center rounded-full font-display text-base font-semibold text-foreground"
      >
        {account.name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {rank ? <span className="text-muted-foreground">#{rank} </span> : null}
          {account.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{account.connectionType}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{account.hook}</p>
      </div>
      <div className="shrink-0 text-right">
        <span className="font-display text-lg font-semibold tabular-nums">{account.score}</span>
        <span className="block text-[10px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
