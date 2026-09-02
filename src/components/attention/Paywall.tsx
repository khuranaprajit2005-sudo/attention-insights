import { formatPrice, PRICE_IN_PAISE } from "@/lib/payments/pricing";

const LOCKED = [
  { title: "Detailed attention breakdown", detail: "All five signal dimensions, scored." },
  { title: "Top attention signals", detail: "Every high-attention account in your analysis." },
  { title: "Attention momentum", detail: "Whether your signals are rising or cooling." },
  { title: "AI-generated interpretation", detail: "A plain-English read of your score." },
  { title: "Social attention type", detail: "Your personality profile for attention." },
];

export function Paywall({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="card-surface space-y-5 p-6">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold leading-tight">
          The interesting part is still locked 👀
        </h2>
        <p className="text-sm text-muted-foreground">
          Unlock your complete Social Attention Report.
        </p>
      </div>

      <ul className="space-y-2">
        {LOCKED.map((item) => (
          <li key={item.title} className="flex gap-3 rounded-2xl bg-secondary/60 px-3 py-2.5">
            <span aria-hidden className="mt-0.5 text-sm">
              🔒
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{item.title}</span>
              <span className="block text-xs text-muted-foreground">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-center gap-2">
        <span className="font-display text-3xl font-bold">{formatPrice(PRICE_IN_PAISE)}</span>
        <span className="text-xs text-muted-foreground">one-time</span>
      </div>

      <button type="button" className="btn-primary" onClick={onUnlock}>
        Unlock Full Report — {formatPrice(PRICE_IN_PAISE)}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        One-time purchase. No subscription. Payment is simulated in this prototype.
      </p>
    </div>
  );
}
