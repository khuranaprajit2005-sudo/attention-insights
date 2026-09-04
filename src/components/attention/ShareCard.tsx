import { useState } from "react";

interface Props {
  score: number;
  onShareClicked?: () => void;
}

/** Share text never contains any paid identity data — score only. */
function buildShareText(score: number): string {
  return [
    "MY ATTENTION SCORE",
    "",
    `${score}/100 👀`,
    "",
    '"Someone in my circle is definitely paying attention…"',
    "",
    '"Think you know who? 👀"',
  ].join("\n");
}

export function ShareCard({ score, onShareClicked }: Props) {
  const [note, setNote] = useState<string | null>(null);
  const text = buildShareText(score);

  async function copyToClipboard(): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fall through to the manual fallback below */
    }
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }

  async function copy() {
    onShareClicked?.();
    setNote((await copyToClipboard()) ? "Copied to clipboard." : "Select the text above to copy it.");
  }

  async function share() {
    onShareClicked?.();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "AttentionAI", text });
        setNote("Shared.");
        return;
      } catch {
        // User dismissed the sheet or sharing is blocked — fall back to copy.
      }
    }
    setNote((await copyToClipboard()) ? "Copied to clipboard." : "Select the text above to copy it.");
  }

  return (
    <div className="card-surface bg-warm space-y-4 p-6">
      <p className="eyebrow">Share card</p>
      <h2 className="font-display text-lg font-bold leading-tight">
        Apne friend ka score bhi check karo 👀
      </h2>
      <pre className="whitespace-pre-wrap rounded-2xl bg-secondary/60 p-4 text-center text-sm font-sans leading-relaxed">
        {text}
      </pre>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn-secondary flex-1" onClick={copy}>
          Copy Result
        </button>
        <button type="button" className="btn-primary flex-1" onClick={share}>
          Share My Result
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {note ?? "Your share card never includes any name."}
      </p>
    </div>
  );
}
