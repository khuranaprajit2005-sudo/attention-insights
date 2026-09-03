/**
 * Deterministic DEMO analysis engine for Prototype 1.
 *
 * Architecture: analyzeSignals() -> calculateScore() -> generateReport().
 * Every function here is pure and synchronous, so the demo signal source and
 * the demo text generator can each be swapped for an authorized data source
 * and a real LLM call later without touching the UI layer.
 */

import type { AnalysisResult, DemoAccount, Dimensions } from "./types";

const WEIGHTS: Record<keyof Dimensions, number> = {
  engagement: 0.25,
  recency: 0.2,
  frequency: 0.2,
  consistency: 0.15,
  momentum: 0.2,
};

/** Stable 32-bit hash (FNV-1a) so the same username always yields the same demo report. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Deterministic pseudo-random integer in [min, max] derived from username + salt. */
function pick(username: string, salt: string, min: number, max: number): number {
  const h = hash(`${username}::${salt}`);
  return min + (h % (max - min + 1));
}

function clamp(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** Step 1 — gather (demo) signals for a normalized username. */
export function analyzeSignals(username: string): Dimensions {
  return {
    engagement: clamp(pick(username, "engagement", 48, 96)),
    recency: clamp(pick(username, "recency", 45, 95)),
    frequency: clamp(pick(username, "frequency", 42, 94)),
    consistency: clamp(pick(username, "consistency", 40, 92)),
    momentum: clamp(pick(username, "momentum", 44, 95)),
  };
}

/** Step 2 — weighted deterministic score, always clamped to 0-100. */
export function calculateScore(dimensions: Dimensions): number {
  const total =
    dimensions.engagement * WEIGHTS.engagement +
    dimensions.recency * WEIGHTS.recency +
    dimensions.frequency * WEIGHTS.frequency +
    dimensions.consistency * WEIGHTS.consistency +
    dimensions.momentum * WEIGHTS.momentum;
  return clamp(total);
}

function tierFor(score: number): { label: string; emoji: string } {
  if (score >= 80) return { label: "High Attention", emoji: "🔥" };
  if (score >= 60) return { label: "Medium Attention", emoji: "👀" };
  if (score >= 40) return { label: "Steady Attention", emoji: "❤️" };
  return { label: "Quiet Attention", emoji: "🌙" };
}

const DEMO_HANDLES = [
  "ananya",
  "rahul",
  "simran",
  "kabir",
  "meher",
  "arjun",
  "nikita",
  "dev",
  "zoya",
];

/** Playful, non-clinical connection framings. Never asserts feelings or intent. */
const CONNECTION_TYPES = [
  "The Unfinished Story 👀",
  "The Silent Observer",
  "The Unexpected One",
  "The Familiar Face",
  "The Lowkey Admirer",
];

const HOOKS = [
  "Shows up more often than you'd expect.",
  "Quiet, but consistently around.",
  "Turns up right after you post.",
  "Never far from your recent activity.",
  "Keeps circling back.",
];

/** Deterministic stride: index 0 stays identical to the previous model. */
const ACCOUNT_STRIDE = [1, 3, 5, 7, 9];

function buildDemoAccounts(username: string, score: number): DemoAccount[] {
  const offset = pick(username, "accounts", 0, DEMO_HANDLES.length - 1);
  return ACCOUNT_STRIDE.map((stride, i) => {
    const handle = DEMO_HANDLES[(offset + stride) % DEMO_HANDLES.length]!;
    const accountScore = clamp(score - i * pick(username, `gap${i}`, 4, 9) + 6);
    const tier = tierFor(accountScore);
    return {
      handle: `@${handle}`,
      name: handle.charAt(0).toUpperCase() + handle.slice(1),
      score: accountScore,
      label: `${tier.label.toUpperCase()}`,
      emoji: tier.emoji,
      connectionType: CONNECTION_TYPES[pick(username, `conn${i}`, 0, CONNECTION_TYPES.length - 1)]!,
      hook: HOOKS[pick(username, `hook${i}`, 0, HOOKS.length - 1)]!,
    };
  });
}


const ATTENTION_TYPES = [
  {
    name: "THE MAGNET 🔥",
    description:
      "You appear to generate stronger-than-average attention signals across your social circle.",
  },
  {
    name: "THE SLOW BURN 👀",
    description:
      "Your attention signals build quietly over time instead of spiking — steady curiosity around your profile.",
  },
  {
    name: "THE SPOTLIGHT ✨",
    description:
      "Your activity tends to concentrate attention into short, intense bursts of interest.",
  },
  {
    name: "THE MYSTERY ❤️",
    description:
      "You post less than average, and that scarcity appears to sharpen the attention you receive.",
  },
];

/** Step 3 — turn scored signals into a human-readable report (swap for an LLM later). */
export function generateReport(username: string, dimensions: Dimensions): AnalysisResult {
  const score = calculateScore(dimensions);
  const tier = tierFor(score);
  const momentumPercent = pick(username, "momentumPct", 6, 34);
  const handle = `@${username}`;

  return {
    username: handle,
    score,
    tier,
    dimensions,
    momentumPercent,
    signalCount: pick(username, "signals", 4, 11),
    topAccounts: buildDemoAccounts(username, score),
    relationshipInterest: clamp(pick(username, "relationship", 52, 92)),
    attentionType: ATTENTION_TYPES[pick(username, "type", 0, ATTENTION_TYPES.length - 1)]!,
    overview: `${handle} scores ${score}/100 on the AttentionAI demo model. ${tier.label} ${tier.emoji} — your engagement (${dimensions.engagement}) and recency (${dimensions.recency}) signals are doing most of the heavy lifting, while consistency (${dimensions.consistency}) is the easiest thing for you to improve. This is an AI interpretation of demo signals, not verified profile-visit data.`,
    isDemoData: true,
  };
}

/** Convenience pipeline used by the UI. */
export function runAnalysis(username: string): AnalysisResult {
  return generateReport(username, analyzeSignals(username));
}
