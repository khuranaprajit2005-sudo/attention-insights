/**
 * ⚠️ DEMO PAYMENT SERVICE — NOT PRODUCTION PAYMENT VERIFICATION.
 *
 * This module simulates a gateway so the rest of the system (payment records,
 * server-side verification step, entitlement grant) can be built and tested.
 * There is NO real money movement and NO cryptographic verification here.
 *
 * The interface deliberately mirrors a real gateway lifecycle
 * (createOrder -> capture -> verify) so a Razorpay/Stripe implementation can
 * replace the internals in the next step without changing callers.
 */

import type { PaymentMethod } from "./pricing";

export interface DemoGatewayOrder {
  providerOrderId: string;
  amountInPaise: number;
  currency: "INR";
}

export interface DemoGatewayCapture {
  status: "captured" | "failed";
  providerPaymentId?: string;
  failureReason?: string;
}

export const DEMO_PROVIDER = "demo" as const;

export function createDemoOrder(amountInPaise: number): DemoGatewayOrder {
  return {
    providerOrderId: `demo_order_${crypto.randomUUID()}`,
    amountInPaise,
    currency: "INR",
  };
}

/**
 * Simulated capture. `forceFailure` powers the dev-only QA failure path and is
 * only ever reachable when the server is running in development.
 */
export function captureDemoPayment(
  order: DemoGatewayOrder,
  method: PaymentMethod,
  options: { forceFailure?: boolean } = {},
): DemoGatewayCapture {
  if (options.forceFailure) {
    return {
      status: "failed",
      failureReason:
        "Payment was declined by the demo gateway. No money was charged — please try again.",
    };
  }
  return {
    status: "captured",
    providerPaymentId: `demo_pay_${method}_${order.providerOrderId}`,
  };
}

/**
 * Stands in for real gateway-side verification (signature check + amount match).
 * PROTOTYPE 2: this only re-checks the demo capture shape and the amount.
 */
export function verifyDemoPayment(
  capture: DemoGatewayCapture,
  order: DemoGatewayOrder,
  expectedAmountInPaise: number,
): boolean {
  return (
    capture.status === "captured" &&
    Boolean(capture.providerPaymentId) &&
    order.amountInPaise === expectedAmountInPaise
  );
}
