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
  score: number;
  label: string;
  emoji: string;
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
