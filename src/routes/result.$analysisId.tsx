import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Header } from "@/components/attention/Header";
import { ScoreCard } from "@/components/attention/ScoreCard";
import { SignalCard } from "@/components/attention/SignalCard";
import { Paywall } from "@/components/attention/Paywall";
import { ErrorMessage } from "@/components/attention/ErrorMessage";
import { getFreeResult } from "@/lib/attention.functions";
import { getSessionToken } from "@/lib/session";
import type { FreeReport } from "@/lib/analysis/types";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/result/$analysisId")({
  head: () => ({
    meta: [
      { title: "Your AI Attention Score — AttentionAI" },
      {
        name: "description",
        content:
          "See your AttentionAI score, engagement, recency, frequency, consistency and momentum signals from your demo analysis.",
      },
      { property: "og:title", content: "Your AI Attention Score — AttentionAI" },
      {
        property: "og:description",
        content: "Attention score, signals and momentum from your AI analysis.",
      },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { analysisId } = Route.useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<FreeReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFreeResult({ data: { analysisId, sessionToken: getSessionToken() } })
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        track("free_result_viewed", { analysisId, score: data.score });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(
          e instanceof Error && e.message
            ? e.message
            : "We could not load this result. Please start a new analysis.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  if (error) {
    return (
      <Shell>
        <ErrorMessage message={error} />
        <Link to="/" className="btn-secondary mt-4 w-full">
          Go home
        </Link>
      </Shell>
    );
  }

  if (!result) {
    return (
      <Shell>
        <p className="text-center text-sm text-muted-foreground">Loading your result...</p>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md space-y-5 px-4 py-8">
        <ScoreCard
          score={result.score}
          label={result.tier.label}
          handle={result.username}
        />

        <div className="grid grid-cols-2 gap-3">
          <SignalCard label="Engagement" value={result.dimensions.engagement} />
          <SignalCard label="Recency" value={result.dimensions.recency} />
          <SignalCard label="Interaction Frequency" value={result.dimensions.frequency} />
          <SignalCard label="Consistency" value={result.dimensions.consistency} />
        </div>
        <SignalCard label="Momentum" value={result.momentumPercent} suffix="%" showBar={false} />

        <div className="card-surface p-5 text-center">
          <p className="font-display text-lg font-bold">
            We found {result.signalCount} strong attention signals
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            We identified {result.signalCount} strong attention signals in your demo analysis.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold">Top attention accounts (demo)</h2>
          <div className="card-surface flex items-center gap-3 p-4">
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-bold"
            >
              {result.topInitial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                Name starts with {result.topInitial}. 👀
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Attention score {result.topScore} — unlock to reveal who.
              </p>
            </div>
          </div>
          {Array.from({ length: result.lockedAccountCount }).map((_, i) => (
            <div
              key={`locked-${i}`}
              className="card-surface flex items-center gap-3 p-4"
              aria-label="Locked attention signal"
            >
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-base"
              >
                🔒
              </span>
              <div className="min-w-0 flex-1">
                <p className="select-none truncate font-semibold blur-[6px]">@hidden_account</p>
                <p className="truncate text-xs text-muted-foreground">
                  Unlock the full report to reveal this signal.
                </p>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Demo identities only. This does not mean these accounts visited your profile.
          </p>
        </section>

        {result.unlocked ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate({ to: "/report/$analysisId", params: { analysisId } })}
          >
            View Full Report
          </button>
        ) : (
          <Paywall
            onUnlock={() => {
              track("checkout_started", { analysisId });
              navigate({ to: "/checkout/$analysisId", params: { analysisId } });
            }}
          />
        )}
      </main>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md px-4 py-10">{children}</main>
    </div>
  );
}
