/**
 * Report entitlement store.
 * PROTOTYPE 1 ONLY: persisted in localStorage. Production must resolve
 * entitlement server-side from a verified payment record.
 */

const KEY = "attentionai.entitlements.v1";

function read(): Record<string, { paymentId: string; at: number }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function grantReportAccess(username: string, paymentId: string) {
  if (typeof window === "undefined") return;
  const all = read();
  all[username] = { paymentId, at: Date.now() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — the session simply won't persist */
  }
}

export function hasReportAccess(username: string): boolean {
  return Boolean(read()[username]);
}
