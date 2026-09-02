import { useState } from "react";
import { formatPrice, PRICE_IN_PAISE, type PaymentMethod } from "@/lib/payments/pricing";
import { ErrorMessage } from "./ErrorMessage";

const METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "upi", label: "UPI", hint: "GPay / PhonePe / Paytm" },
  { id: "card", label: "Card", hint: "Debit or credit" },
  { id: "netbanking", label: "Net Banking", hint: "All major banks" },
];

type Status = "idle" | "processing" | "success" | "failed";

interface Props {
  username: string;
  /** Server call. The server — not this component — decides if payment succeeded. */
  onPay: (
    method: PaymentMethod,
    simulateFailure: boolean,
  ) => Promise<{ status: "paid" } | { status: "failed"; error: string }>;
  onPaid: () => void;
  onCancel: () => void;
  onPaymentStarted?: (method: PaymentMethod) => void;
  onPaymentFailed?: () => void;
}

export function Checkout({
  username,
  onPay,
  onPaid,
  onCancel,
  onPaymentStarted,
  onPaymentFailed,
}: Props) {
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);

  async function pay() {
    if (status === "processing") return;
    setStatus("processing");
    setError(null);
    onPaymentStarted?.(method);

    try {
      const result = await onPay(method, simulateFailure);
      if (result.status !== "paid") {
        setStatus("failed");
        setError(result.error);
        onPaymentFailed?.();
        return;
      }
      setStatus("success");
      setTimeout(() => onPaid(), 900);
    } catch {
      setStatus("failed");
      setError("Something went wrong while processing the payment. Please try again.");
      onPaymentFailed?.();
    }
  }

  return (
    <div className="card-surface space-y-5 p-6">
      <div>
        <h2 className="font-display text-xl font-bold">Checkout</h2>
        <p className="text-xs text-muted-foreground">Simulated payment — no real money is charged.</p>
      </div>

      <div className="flex items-start justify-between gap-3 rounded-2xl bg-secondary/60 p-4">
        <div>
          <p className="font-semibold">Full AI Social Attention Report</p>
          <p className="text-xs text-muted-foreground">for @{username}</p>
        </div>
        <span className="font-display text-xl font-bold">{formatPrice(PRICE_IN_PAISE)}</span>
      </div>

      <fieldset className="space-y-2" disabled={status === "processing" || status === "success"}>
        <legend className="mb-2 text-sm text-muted-foreground">Payment method</legend>
        {METHODS.map((m) => (
          <label
            key={m.id}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 ${
              method === m.id ? "border-primary bg-primary/10" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="method"
              value={m.id}
              checked={method === m.id}
              onChange={() => setMethod(m.id)}
              className="accent-[oklch(0.68_0.24_12)]"
            />
            <span className="flex-1">
              <span className="block text-sm font-semibold">{m.label}</span>
              <span className="block text-xs text-muted-foreground">{m.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {import.meta.env.DEV ? (
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
          />
          QA (dev only): simulate a payment failure
        </label>
      ) : null}

      {error ? <ErrorMessage message={error} /> : null}

      {status === "success" ? (
        <p className="rounded-xl bg-success/15 px-3 py-2 text-center text-sm font-semibold text-success">
          Payment successful ✓ Unlocking your report...
        </p>
      ) : null}

      <button type="button" className="btn-primary" onClick={pay} disabled={status === "processing" || status === "success"}>
        {status === "processing"
          ? "Processing payment..."
          : `Pay ${formatPrice(PRICE_IN_PAISE)}`}
      </button>

      <button
        type="button"
        className="w-full text-center text-xs text-muted-foreground underline underline-offset-4"
        onClick={onCancel}
        disabled={status === "processing"}
      >
        Back to my free result
      </button>
    </div>
  );
}
