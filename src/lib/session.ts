/**
 * Anonymous session token holder.
 *
 * The token is generated and hashed SERVER-SIDE; the browser only stores the
 * opaque value it was handed. It identifies *which* anonymous session is
 * making a request — it never asserts payment, entitlement or access. All of
 * those decisions are made server-side against the database.
 */

const KEY = "attentionai.session.v2";

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    /* storage unavailable — the session simply won't persist */
  }
}
