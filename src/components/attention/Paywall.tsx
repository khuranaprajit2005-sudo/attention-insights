import { formatPrice, PRICE_IN_PAISE } from "@/lib/payments/demoPaymentService";

const LOCKED = [
  "Top attention signals",
  "Detailed attention breakdown",
  "Relationship-interest analysis",
  "Attention momentum",
  "Personalized AI explanation",
  "Social attention type",
];

export function Paywall({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="card-surface space-y-4 p-6">
      <h2 className="font-display text-xl font-bold leading-tight">
        THE INTERESTING PART IS STILL LOCKED 👀
      </h2>
      <p className="text-sm text-muted-foreground">
        Unlock your complete AI Social Attention Report.
      </p>

      <ul className="space-y-2">
        {LOCKED.map((item) => (
          <li key={item} className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm">
            <span aria-hidden>🔒</span>
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="btn-primary" onClick={onUnlock}>
        UNLOCK FULL REPORT — {formatPrice(PRICE_IN_PAISE)}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        One-time purchase · no subscription · demo payment in this prototype
      </p>
    </div>
  );
}
