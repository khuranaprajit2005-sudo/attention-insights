import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/attention/Header";
import { ScoreCard } from "@/components/attention/ScoreCard";
import { SignalCard } from "@/components/attention/SignalCard";
import { AccountCard } from "@/components/attention/AccountCard";
import { ReportSection } from "@/components/attention/ReportSection";
import { ShareCard } from "@/components/attention/ShareCard";
import { ErrorMessage } from "@/components/attention/ErrorMessage";
import { runAnalysis } from "@/lib/analysis/engine";
import { validateUsername } from "@/lib/analysis/validation";
import { hasReportAccess } from "@/lib/entitlements";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/report/$analysisId")({
  head: () => ({
    meta: [
      { title: "Your Complete Social Attention Report — AttentionAI" },
      {
        name: "description",
        content:
          "The full AttentionAI report: attention overview, breakdown, top signals, relationship interest, momentum and your social attention type.",
      },
      { property: "og:title", content: "Your Complete Social Attention Report" },
      {
        property: "og:description",
        content: "Attention overview, breakdown, top signals, momentum and attention type.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const validation = validateUsername(username);
  const result = useMemo(
    () => (validation.ok ? runAnalysis(validation.username!) : null),
    [validation.ok, validation.username],
  );
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    if (!validation.ok) return;
    const access = hasReportAccess(validation.username!);
    setUnlocked(access);
    if (access) track("report_viewed", { username: validation.username! });
  }, [validation.ok, validation.username]);

  if (!result) {
    return (
      <Shell>
        <ErrorMessage message="We couldn't load this report. Please try again with a valid username." />
        <Link to="/" className="btn-secondary mt-4 w-full">
          Back to home
        </Link>
      </Shell>
    );
  }

  if (unlocked === null) {
    return (
      <Shell>
        <p className="text-center text-sm text-muted-foreground">Loading your report...</p>
      </Shell>
    );
  }

  if (!unlocked) {
    return (
      <Shell>
        <div className="card-surface space-y-4 p-6 text-center">
          <h1 className="font-display text-xl font-bold">This report is locked</h1>
          <p className="text-sm text-muted-foreground">
            Complete the one-time ₹99 unlock to view your full Social Attention Report.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              navigate({ to: "/checkout/$username", params: { username: validation.username! } })
            }
          >
            Unlock Full Report — ₹99
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md space-y-8 px-4 py-8">
        <header className="space-y-1 text-center">
          <h1 className="font-display text-2xl font-bold leading-tight">
            Your Complete Social Attention Report
          </h1>
          <p className="text-xs text-muted-foreground">{result.username} · demo analysis</p>
        </header>

        <ScoreCard
          score={result.score}
          label={result.tier.label}
          emoji={result.tier.emoji}
          handle={result.username}
        />

        <ReportSection index={1} title="Attention Overview">
          <p className="card-surface p-4 text-sm leading-relaxed text-muted-foreground">
            {result.overview}
          </p>
        </ReportSection>

        <ReportSection index={2} title="Attention Breakdown">
          <div className="space-y-3">
            <SignalCard label="Engagement" value={result.dimensions.engagement} />
            <SignalCard label="Recency" value={result.dimensions.recency} />
            <SignalCard label="Interaction Frequency" value={result.dimensions.frequency} />
            <SignalCard label="Consistency" value={result.dimensions.consistency} />
            <SignalCard label="Momentum" value={result.dimensions.momentum} />
          </div>
        </ReportSection>

        <ReportSection index={3} title="Highest Attention Signals">
          <div className="space-y-3">
            {result.topAccounts.map((account) => (
              <AccountCard key={account.handle} account={account} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Demo identities only. This does not indicate that these accounts viewed your profile.
          </p>
        </ReportSection>

        <ReportSection index={4} title="Relationship Interest">
          <div className="card-surface space-y-2 p-4">
            <p className="font-display text-2xl font-bold">{result.relationshipInterest}/100</p>
            <p className="text-sm text-muted-foreground">
              This is an AI interpretation of available demo signals — not a verified psychological
              or relationship assessment.
            </p>
          </div>
        </ReportSection>

        <ReportSection index={5} title="Attention Momentum">
          <div className="card-surface space-y-2 p-4">
            <p className="font-display text-2xl font-bold text-success">
              +{result.momentumPercent}%
            </p>
            <p className="text-sm text-muted-foreground">
              Your recent attention signals are trending upward in this demo analysis.
            </p>
          </div>
        </ReportSection>

        <ReportSection index={6} title="Social Attention Type">
          <div className="card-surface space-y-2 p-5">
            <p className="text-gradient font-display text-2xl font-bold">
              {result.attentionType.name}
            </p>
            <p className="text-sm text-muted-foreground">{result.attentionType.description}</p>
          </div>
        </ReportSection>

        <ShareCard score={result.score} onShareClicked={() => track("share_clicked", { username })} />

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
