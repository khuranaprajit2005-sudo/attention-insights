/** User-facing signal names (presentation only — the scoring model is unchanged). */

import type { DimensionKey } from "./types";

export const SIGNAL_LABELS: Record<DimensionKey, { emoji: string; name: string; note: string }> = {
  engagement: {
    emoji: "👀",
    name: "Lowkey Watching",
    note: "How closely your activity is being followed.",
  },
  recency: {
    emoji: "⏰",
    name: "Just Happened",
    note: "How fresh the most recent signals are.",
  },
  frequency: {
    emoji: "🔁",
    name: "Keeps Coming Back",
    note: "How often the interaction repeats.",
  },
  consistency: {
    emoji: "📌",
    name: "Always There",
    note: "How steady the pattern is over time.",
  },
  momentum: {
    emoji: "📈",
    name: "Getting Interesting",
    note: "Whether the pattern is warming up or cooling down.",
  },
};
