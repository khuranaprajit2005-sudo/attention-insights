import { useId, useState, type FormEvent } from "react";
import { validateUsername } from "@/lib/analysis/validation";
import { ErrorMessage } from "./ErrorMessage";

interface Props {
  onSubmit: (username: string) => void;
  submitting?: boolean;
  ctaLabel?: string;
}

export function UsernameForm({ onSubmit, submitting = false, ctaLabel = "Reveal My Score" }: Props) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return; // prevents duplicate submissions
    const result = validateUsername(value);
    if (!result.ok || !result.username) {
      setError(result.error ?? "Please enter a valid username.");
      return;
    }
    setError(null);
    onSubmit(result.username);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left" noValidate>
      <label htmlFor={inputId} className="block text-sm font-medium">
        Instagram username
      </label>

      <div className="flex items-center gap-1 rounded-2xl border border-border bg-input px-4 transition-all focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15">
        <span aria-hidden className="text-muted-foreground">
          @
        </span>
        <input
          id={inputId}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="yourusername"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={40}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      {error ? (
        <div id={errorId}>
          <ErrorMessage message={error} />
        </div>
      ) : null}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Starting analysis…" : ctaLabel}
      </button>

      <p className="text-center text-xs text-muted-foreground">🔒 No Instagram password required</p>
    </form>
  );
}
