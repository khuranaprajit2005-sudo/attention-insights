/**
 * Simulated payment layer for Prototype 1.
 *
 * The shape mirrors a real gateway flow (create checkout -> initiate ->
 * verify -> store record), so a Razorpay + server-side verification layer can
 * replace the internals without changing callers.
 *
 * PROTOTYPE LIMITATION: entitlement is stored client-side. In production the
 * verification and entitlement MUST happen server-side.
 */

export type PaymentMethod = "upi" | "card" | "netbanking";

export interface CheckoutSession {
  id: string;
  username: string;
  amountInPaise: number;
  currency: "INR";
  productName: string;
  createdAt: number;
}

export interface PaymentResult {
  status: "success" | "failed";
  paymentId?: string;
  error?: string;
}

export const PRICE_IN_PAISE = 9900;

export function formatPrice(paise: number): string {
  return `₹${Math.round(paise / 100)}`;
}

export function createCheckoutSession(username: string): CheckoutSession {
  return {
    id: `demo_cs_${Date.now().toString(36)}`,
    username,
    amountInPaise: PRICE_IN_PAISE,
    currency: "INR",
    productName: "Full AI Social Attention Report",
    createdAt: Date.now(),
  };
}

/** Simulates gateway processing. `forceFailure` powers the QA failure path. */
export function initiatePayment(
  session: CheckoutSession,
  method: PaymentMethod,
  options: { forceFailure?: boolean } = {},
): Promise<PaymentResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (options.forceFailure) {
        resolve({
          status: "failed",
          error: "Payment was declined by the demo gateway. No money was charged — please try again.",
        });
        return;
      }
      resolve({ status: "success", paymentId: `demo_pay_${method}_${session.id}` });
    }, 1800);
  });
}

/** Stands in for a server-side verification call. */
export async function verifyPayment(result: PaymentResult): Promise<boolean> {
  return result.status === "success" && Boolean(result.paymentId);
}
