import { useState } from "react";

interface Props {
  score: number;
  onShareClicked?: () => void;
}

export function ShareCard({ score, onShareClicked }: Props) {
  const [note, setNote] = useState<string | null>(null);
  const text = `MY AI ATTENTION SCORE 🔥\n\n${score}/100\n\nApparently people are paying attention 👀\n\nCheck yours.`;

  async function copy() {
    onShareClicked?.();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setNote("Copied to clipboard.");
        return;
      }
      throw new Error("no clipboard");
    } catch {
      setNote("Copying is not available here — select and copy the text above.");
    }
  }

  async function share() {
    onShareClicked?.();
    try {
      if (navigator.share) {
        await navigator.share({ title: "AttentionAI", text });
        setNote("Share sheet opened.");
        return;
      }
      await copy();
    } catch {
      setNote("Sharing was cancelled.");
    }
  }

  return (
    <div className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-bold">Apne friend ka score bhi check karo 👀</h2>
      <pre className="whitespace-pre-wrap rounded-2xl bg-secondary/60 p-4 text-sm font-sans">{text}</pre>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn-secondary flex-1" onClick={copy}>
          Copy Result
        </button>
        <button type="button" className="btn-primary flex-1" onClick={share}>
          Share My Result
        </button>
      </div>
      {note ? <p className="text-center text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}
