/** Username input validation + normalization. Pure, testable, no UI concerns. */

export interface ValidationResult {
  ok: boolean;
  username?: string; // normalized WITHOUT the leading @
  error?: string;
}

const MAX_LENGTH = 30;
const ALLOWED = /^[a-zA-Z0-9._]+$/;

export function validateUsername(raw: string): ValidationResult {
  const trimmed = (raw ?? "").trim().replace(/^@+/, "");

  if (!trimmed) {
    return { ok: false, error: "Username daalo pehle — bina username ke analysis nahi ho sakta." };
  }
  if (trimmed.length > MAX_LENGTH) {
    return { ok: false, error: `Ye username thoda zyada lamba hai (max ${MAX_LENGTH} characters).` };
  }
  if (!ALLOWED.test(trimmed)) {
    return {
      ok: false,
      error: "Sirf letters, numbers, dot aur underscore allowed hain. Try again 🙂",
    };
  }

  return { ok: true, username: trimmed.toLowerCase() };
}

/** Display-safe handle, always prefixed with @. */
export function formatHandle(username: string): string {
  return `@${username.replace(/^@+/, "").toLowerCase()}`;
}
