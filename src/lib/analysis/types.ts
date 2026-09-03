/** Shared types for the AttentionAI demo analysis engine (Prototype 1). */

export type DimensionKey =
  | "engagement"
  | "recency"
  | "frequency"
  | "consistency"
  | "momentum";

export interface Dimensions {
  engagement: number;
  recency: number;
  frequency: number;
  consistency: number;
  momentum: number;
}

export interface DemoAccount {
  handle: string;
  /** Display name derived from the demo handle. Paid data — never in free payloads. */
  name: string;
  score: number;
  label: string;
  emoji: string;
  connectionType: string;
  hook: string;
}

export interface AnalysisResult {
  username: string; // normalized, with leading @
  score: number; // 0-100
  tier: { label: string; emoji: string };
  dimensions: Dimensions;
  momentumPercent: number; // e.g. +23
  signalCount: number;
  topAccounts: DemoAccount[];
  relationshipInterest: number;
  attentionType: { name: string; description: string };
  overview: string;
  isDemoData: true;
}

/** The teaser payload — the ONLY analysis data sent to the browser pre-payment. */
export interface FreeReport {
  analysisId: string;
  username: string; // normalized, with leading @
  score: number;
  tier: { label: string; emoji: string };
  dimensions: {
    engagement: number;
    recency: number;
    frequency: number;
    consistency: number;
  };
  momentumPercent: number;
  signalCount: number;
  /** ONLY the first initial of the ranked #1 account — no names leave the server. */
  topInitial: string;
  topScore: number;
  lockedAccountCount: number;
  unlocked: boolean;
  isDemoData: true;
}

/** Server response for a paid report request. */
export type ReportAccessResponse =
  | { unlocked: false }
  | { unlocked: true; report: AnalysisResult & { analysisId: string } };
