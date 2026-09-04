import type { DemoAccount } from "@/lib/analysis/types";
import {
  formatPrice,
  SECONDARY_BUNDLE_IN_PAISE,
  SECONDARY_SINGLE_IN_PAISE,
} from "@/lib/payments/pricing";

/**
 * #2–#5 are shown by name once #1 is unlocked, but their detailed reports stay
 * locked. Unlocking #1 never unlocks these — purchases are not wired up yet.
 */
export function SecondaryReports({ accounts }: { accounts: DemoAccount[] }) {
  if (accounts.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-display text-lg font-bold">The rest of your circle</h2>
        <p className="text-xs text-muted-foreground">
          Names and scores are included. Their detailed reports are still locked.
        </p>
      </div>

      <div className="space-y-3">
        {accounts.map((account, i) => (
          <div key={account.handle} className="card-surface card-lift p-4">
            <div className="flex items-center gap-3.5">
              <span
                aria-hidden
                className="bg-warm grid size-11 shrink-0 place-items-center rounded-full font-display text-base font-semibold text-foreground"
              >
                {account.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  <span className="text-muted-foreground">#{i + 2} </span>
                  {account.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">{account.connectionType}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{account.hook}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-display text-lg font-semibold tabular-nums">
                  {account.score}
                </span>
                <span className="block text-[10px] text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-secondary/60 px-3 py-2">
              <span className="text-xs text-muted-foreground">🔒 Detailed report locked</span>
              <span className="chip">
                {formatPrice(SECONDARY_SINGLE_IN_PAISE)} — Unlock This Report
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-surface bg-warm space-y-2 p-5 text-center">
        <span className="chip">BEST VALUE</span>
        <p className="font-display text-2xl font-bold">
          {formatPrice(SECONDARY_BUNDLE_IN_PAISE)} — Unlock All 4
        </p>
        <p className="text-xs text-muted-foreground">
          Coming soon. These reports are not included with your #1 unlock.
        </p>
      </div>
    </section>
  );
}
