import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/attention/Header";
import { AnalysisProgress } from "@/components/attention/AnalysisProgress";
import { ErrorMessage } from "@/components/attention/ErrorMessage";
import { track } from "@/lib/analytics";
import { validateUsername, formatHandle } from "@/lib/analysis/validation";

const STEP_LABELS = [
  "Profile input received",
  "Analyzing attention signals",
  "Calculating your score",
  "Modelling social interest",
  "Preparing your personalized report",
];

const TOTAL_MS = 6400;

export const Route = createFileRoute("/analyze/$username")({
  head: () => ({
    meta: [
      { title: "Analyzing your attention signals — AttentionAI" },
      {
        name: "description",
        content: "AttentionAI is preparing your personalized AI social attention analysis.",
      },
      { property: "og:title", content: "Analyzing your attention signals — AttentionAI" },
      {
        property: "og:description",
        content: "Your AI social attention report is being generated.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const validation = validateUsername(username);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!validation.ok) return;
    track("analysis_started", { username });
    startedAt.current = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt.current;
      const next = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgress(next);
      if (next >= 100) {
        window.clearInterval(interval);
        track("analysis_completed", { username });
      }
    }, 120);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, validation.ok]);

  if (!validation.ok) {
    return (
      <Shell>
        <ErrorMessage message={validation.error ?? "Please enter a valid username."} />
        <Link to="/" className="btn-secondary mt-4 w-full">
          Try another username
        </Link>
      </Shell>
    );
  }

  if (failed) {
    return (
      <Shell>
        <ErrorMessage message="We could not complete the analysis. Please check your connection and try again." />
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => {
            setFailed(false);
            setProgress(0);
            startedAt.current = Date.now();
          }}
        >
          Retry analysis
        </button>
      </Shell>
    );
  }

  const done = progress >= 100;
  const stepsDone = Math.floor((progress / 100) * STEP_LABELS.length);

  return (
    <Shell>
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Analyzing {formatHandle(validation.username!)}
      </p>

      <AnalysisProgress
        progress={progress}
        steps={STEP_LABELS.map((label, i) => ({ label, done: i < stepsDone }))}
      />

      {done ? (
        <div className="mt-5 space-y-3 text-center">
          <p className="font-display text-xl font-bold">Your report is ready 🔥</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              navigate({ to: "/result/$username", params: { username: validation.username! } })
            }
          >
            See My Score
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted-foreground underline underline-offset-4"
          onClick={() => setFailed(true)}
        >
          QA: simulate analysis failure
        </button>
      )}
    </Shell>
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
