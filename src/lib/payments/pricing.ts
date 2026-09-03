/**
 * Client-safe pricing helpers. No gateway logic lives here.
 * Payment initiation and verification are server-side only.
 */

export type PaymentMethod = "upi" | "card" | "netbanking";

/** Launch price for the #1 reveal report. */
export const PRICE_IN_PAISE = 9900;

/** Display-only pricing for the secondary (#2–#5) reports — not purchasable yet. */
export const SECONDARY_SINGLE_IN_PAISE = 4900;
export const SECONDARY_BUNDLE_IN_PAISE = 15000;

export function formatPrice(paise: number): string {
  return `₹${Math.round(paise / 100)}`;
}
