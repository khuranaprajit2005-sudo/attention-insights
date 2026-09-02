/**
 * Client-safe pricing helpers. No gateway logic lives here.
 * Payment initiation and verification are server-side only.
 */

export type PaymentMethod = "upi" | "card" | "netbanking";

export const PRICE_IN_PAISE = 9900;

export function formatPrice(paise: number): string {
  return `₹${Math.round(paise / 100)}`;
}
