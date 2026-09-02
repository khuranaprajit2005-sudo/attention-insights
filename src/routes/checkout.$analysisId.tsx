import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/attention/Header";
import { Checkout } from "@/components/attention/Checkout";
import { ErrorMessage } from "@/components/attention/ErrorMessage";
import { getFreeResult, payForReport } from "@/lib/attention.functions";
import { getSessionToken } from "@/lib/session";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/checkout/$analysisId")({
  head: () => ({
    meta: [
      { title: "Checkout — Full AI Social Attention Report (₹99)" },
      {
        name: "description",
        content:
          "Unlock the complete AttentionAI report for ₹99. One-time purchase, simulated payment in this prototype.",
      },
      { property: "og:title", content: "Checkout — Full AI Social Attention Report" },
      { property: "og:description", content: "One-time ₹99 unlock for your complete AI report." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { analysisId } = Route.useParams();
  const navigate = useNavigate();
  const [handle, setHandle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFreeResult({ data: { analysisId, sessionToken: getSessionToken() } })
      .then((data) => !cancelled && setHandle(data.username.replace(/^@/, "")))
      .catch((e: unknown) =>
        !cancelled
          ? setError(
              e instanceof Error && e.message
                ? e.message
                : "We could not open checkout. Please start again.",
            )
          : undefined,
      );
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

  if (!handle) {
    return (
      <Shell>
        <p className="text-center text-sm text-muted-foreground">Opening checkout...</p>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md px-4 py-8">
        <Checkout
          username={handle}
          onPay={(method, simulateFailure) =>
            payForReport({
              data: { analysisId, sessionToken: getSessionToken(), method, simulateFailure },
            })
          }
          onPaymentStarted={(method) => track("payment_started", { analysisId, method })}
          onPaymentFailed={() => track("payment_failed", { analysisId })}
          onPaid={() => navigate({ to: "/report/$analysisId", params: { analysisId } })}
          onCancel={() => navigate({ to: "/result/$analysisId", params: { analysisId } })}
        />
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
