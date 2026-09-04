import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/attention/Header";
import { SignalCard } from "@/components/attention/SignalCard";
import { ReportSection } from "@/components/attention/ReportSection";
import { ShareCard } from "@/components/attention/ShareCard";
import { SecondaryReports } from "@/components/attention/SecondaryReports";
import { ErrorMessage } from "@/components/attention/ErrorMessage";
import { getFullReport } from "@/lib/attention.functions";
import { getSessionToken } from "@/lib/session";
import { SIGNAL_LABELS } from "@/lib/analysis/labels";
import type { AnalysisResult, DimensionKey } from "@/lib/analysis/types";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/report/$analysisId")({
  head: () => ({
    meta: [
      { title: "Attention Insights — Your #1 Reveal | AttentionAI" },
      {
        name: "description",
        content:
          "Your unlocked Attention Insights report: the #1 reveal, quick verdict, five signal breakdowns, connection type and a shareable score card.",
      },
      { property: "og:title", content: "Attention Insights — Your #1 Reveal" },
      {
        property: "og:description",
        content: "The reveal, the five signals, the connection type and the final verdict.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

const ORDER: DimensionKey[] = [
  "engagement",
  "recency",
  "frequency",
  "consistency",
  "momentum",
];

function ReportPage() {
  const { analysisId } = Route.useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "locked" }
    | { kind: "error"; message: string }
    | { kind: "ready"; report: AnalysisResult }
  >({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    getFullReport({ data: { analysisId, sessionToken: getSessionToken() } })
      .then((data) => {
        if (cancelled) return;
        if (!data.unlocked) {
          setState({ kind: "locked" });
          return;
        }
        setState({ kind: "ready", report: data.report });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            e instanceof Error && e.message
              ? e.message
              : "We could not load this report. Please start a new analysis.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  if (state.kind === "error") {
    return (
      <Shell>
        <ErrorMessage message={state.message} />
        <Link to="/" className="btn-secondary mt-4 w-full">
          Back to home
        </Link>
      </Shell>
    );
  }

  if (state.kind === "loading") {
    return (
      <Shell>
        <p className="text-center text-sm text-muted-foreground">Loading your report...</p>
      </Shell>
    );
  }

  if (state.kind === "locked") {
    return (
      <Shell>
        <div className="card-surface space-y-4 p-6 text-center">
          <h1 className="font-display text-xl font-bold">This report is locked</h1>
          <p className="text-sm text-muted-foreground">
            Complete the one-time ₹99 unlock to view your Attention Insights report.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate({ to: "/checkout/$analysisId", params: { analysisId } })}
          >
            Unlock Full Report — ₹99
          </button>
        </div>
      </Shell>
    );
  }

  const result = state.report;
  const [top, ...rest] = result.topAccounts;
  if (!top) {
    return (
      <Shell>
        <ErrorMessage message="This report is incomplete. Please start a new analysis." />
      </Shell>
    );
  }

  // Presentation-only derivation — the underlying signal values are unchanged.
  const ranked = [...ORDER].sort((a, b) => result.dimensions[b] - result.dimensions[a]);
  const [first, second] = ranked as [DimensionKey, DimensionKey];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md space-y-8 px-4 py-8">
        <header className="space-y-1 text-center">
          <p className="eyebrow">Attention Insights</p>
          <h1 className="font-display text-2xl font-bold leading-tight">Your #1 reveal</h1>
          <p className="text-xs text-muted-foreground">{result.username} · demo analysis</p>
        </header>

        {/* 1 — the reveal */}
        <section className="card-surface bg-warm rise-in space-y-4 p-7 text-center">
          <p className="eyebrow">The name you were waiting for</p>
          <span
            aria-hidden
            className="mx-auto grid size-16 place-items-center rounded-full bg-secondary font-display text-2xl font-bold"
          >
            {top.name.charAt(0).toUpperCase()}
          </span>
          <p className="text-gradient font-display text-4xl font-bold leading-none">{top.name}</p>
          <div>
            <span className="font-display text-3xl font-semibold tabular-nums">{top.score}</span>
            <span className="ml-0.5 text-sm text-muted-foreground">/100</span>
            <span className="mt-1 block text-xs text-muted-foreground">Attention Score</span>
          </div>
          <p className="text-sm text-muted-foreground">{top.connectionType}</p>
        </section>

        {/* 2 — quick verdict */}
        <ReportSection index={1} title="Quick Verdict">
          <div className="card-surface space-y-1 p-4">
            <p className="font-display text-lg font-bold">
              {top.emoji} {top.label}
            </p>
            <p className="text-sm text-muted-foreground">
              There's something interesting about this connection — {top.hook.toLowerCase()}
            </p>
          </div>
        </ReportSection>

        {/* 3 — signals */}
        <ReportSection index={2} title="Signal Breakdown">
          <div className="space-y-3">
            {ORDER.map((key) => {
              const meta = SIGNAL_LABELS[key];
              return (
                <SignalCard
                  key={key}
                  emoji={meta.emoji}
                  label={meta.name}
                  note={meta.note}
                  value={result.dimensions[key]}
                />
              );
            })}
          </div>
        </ReportSection>

        {/* 4 — why they stand out */}
        <ReportSection index={3} title="Why They Stand Out">
          <ul className="card-surface space-y-2 p-4 text-sm">
            <li className="flex gap-2">
              <span aria-hidden>{SIGNAL_LABELS[first].emoji}</span>
              <span>
                <strong>{SIGNAL_LABELS[first].name}</strong> is your strongest signal at{" "}
                {result.dimensions[first]}/100.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>{SIGNAL_LABELS[second].emoji}</span>
              <span>
                <strong>{SIGNAL_LABELS[second].name}</strong> backs it up at{" "}
                {result.dimensions[second]}/100.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>✨</span>
              <span>{top.hook}</span>
            </li>
          </ul>
        </ReportSection>

        {/* 5 — connection type */}
        <ReportSection index={4} title="Connection Type">
          <div className="card-surface space-y-2 p-5">
            <p className="text-gradient font-display text-2xl font-bold">{top.connectionType}</p>
            <p className="text-sm text-muted-foreground">
              Whether it's curiosity, habit, or something more… that's the part we can't know for
              sure.
            </p>
          </div>
        </ReportSection>

        {/* 6 — interpretation */}
        <ReportSection index={5} title="What This Means">
          <div className="card-surface space-y-2 p-4">
            <p className="text-sm">
              {top.name} keeps showing up where your attention signals are loudest. That pattern is
              consistent — not accidental.
            </p>
            <p className="text-xs text-muted-foreground">
              Reality check: this is a demo interpretation of simulated signals. It does not mean
              this person viewed your profile, and it is not a psychological or relationship
              assessment.
            </p>
          </div>
        </ReportSection>

        {/* 7 — final verdict */}
        <ReportSection index={6} title="Final Verdict">
          <div className="card-surface bg-warm space-y-2 p-5 text-center">
            <p className="font-display text-xl font-bold">
              {top.name} is the one paying attention. 👀
            </p>
            <p className="text-sm text-muted-foreground">
              Score {top.score}/100 · {top.connectionType}
            </p>
          </div>
        </ReportSection>

        <SecondaryReports accounts={rest} />

        <ShareCard
          score={result.score}
          onShareClicked={() => track("share_clicked", { analysisId })}
        />

        <Link to="/" className="btn-secondary w-full">
          Analyze another username
        </Link>
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md px-4 py-10">{children}</main>
    </div>
  );
}
