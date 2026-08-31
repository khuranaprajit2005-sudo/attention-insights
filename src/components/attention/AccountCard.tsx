import type { DemoAccount } from "@/lib/analysis/types";

export function AccountCard({ account, blurred = false }: { account: DemoAccount; blurred?: boolean }) {
  return (
    <div className="card-surface flex items-center gap-3 p-4">
      <span className="bg-brand grid size-11 shrink-0 place-items-center rounded-full font-display text-base font-bold text-primary-foreground">
        {account.handle.charAt(1).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${blurred ? "blur-[6px] select-none" : ""}`}>
          {account.handle}
        </p>
        <p className="text-xs text-muted-foreground">
          {account.emoji} {account.label}
        </p>
      </div>
      <span className="font-display text-lg font-bold">{account.score}</span>
    </div>
  );
}
