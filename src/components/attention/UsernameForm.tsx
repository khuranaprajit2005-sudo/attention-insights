import { useState, type FormEvent } from "react";
import { validateUsername } from "@/lib/analysis/validation";
import { ErrorMessage } from "./ErrorMessage";

interface Props {
  onSubmit: (username: string) => void;
  submitting?: boolean;
  ctaLabel?: string;
}

export function UsernameForm({ onSubmit, submitting = false, ctaLabel = "CHECK KARO 👀" }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return; // prevents duplicate submissions
    const result = validateUsername(value);
    if (!result.ok || !result.username) {
      setError(result.error ?? "Kuch galat ho gaya. Try again.");
      return;
    }
    setError(null);
    onSubmit(result.username);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3" noValidate>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-input/60 px-4 focus-within:border-primary">
        <span className="text-muted-foreground">@</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="@username"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={40}
          aria-label="Social username"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </div>

      {error ? <ErrorMessage message={error} /> : null}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Starting..." : ctaLabel}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Username only — password ki zarurat nahi.
      </p>
    </form>
  );
}
