import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Header } from "@/components/attention/Header";
import { ScoreCard } from "@/components/attention/ScoreCard";
import { SignalCard } from "@/components/attention/SignalCard";
import { AccountCard } from "@/components/attention/AccountCard";
import { Paywall } from "@/components/attention/Paywall";
import { ErrorMessage } from "@/components/attention/ErrorMessage";
import { runAnalysis } from "@/lib/analysis/engine";
import { validateUsername } from "@/lib/analysis/validation";
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
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const validation = validateUsername(username);
  const result = useMemo(
    () => (validation.ok ? runAnalysis(validation.username!) : null),
    [validation.ok, validation.username],
  );

  useEffect(() => {
    if (result) track("free_result_viewed", { username, score: result.score });
  }, [result, username]);

  if (!result) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto w-full max-w-md px-4 py-10">
          <ErrorMessage message="We could not load this result. Please try again with a valid username." />
          <Link to="/" className="btn-secondary mt-4 w-full">
            Go home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md space-y-5 px-4 py-8">
        <ScoreCard
          score={result.score}
          label={result.tier.label}
          emoji={result.tier.emoji}
          handle={result.username}
        />

        <div className="grid grid-cols-2 gap-3">
          <SignalCard label="Engagement" value={result.dimensions.engagement} />
          <SignalCard label="Recency" value={result.dimensions.recency} />
          <SignalCard label="Interaction Frequency" value={result.dimensions.frequency} />
          <SignalCard label="Consistency" value={result.dimensions.consistency} />
        </div>
        <SignalCard
          label="Momentum"
          value={result.momentumPercent}
          suffix="%"
          showBar={false}
        />

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
          {result.topAccounts.map((account, i) => (
            <AccountCard key={account.handle} account={account} blurred={i > 0} />
          ))}
          <p className="text-xs text-muted-foreground">
            Demo identities only. This does not mean these accounts visited your profile.
          </p>
        </section>

        <Paywall
          onUnlock={() => {
            track("checkout_started", { username: validation.username! });
            navigate({ to: "/checkout/$username", params: { username: validation.username! } });
          }}
        />
      </main>
    </div>
  );
}
