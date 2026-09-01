import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/attention/Header";
import { Checkout } from "@/components/attention/Checkout";
import { ErrorMessage } from "@/components/attention/ErrorMessage";
import { validateUsername } from "@/lib/analysis/validation";
import { grantReportAccess } from "@/lib/entitlements";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/checkout/$username")({
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
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const validation = validateUsername(username);

  if (!validation.ok) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto w-full max-w-md px-4 py-10">
          <ErrorMessage message="We could not open checkout. Please start again with a valid username." />
          <Link to="/" className="btn-secondary mt-4 w-full">
            Go home
          </Link>
        </main>
      </div>
    );
  }

  const normalized = validation.username!;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-md px-4 py-8">
        <Checkout
          username={normalized}
          onPaymentStarted={(method) => track("payment_started", { username: normalized, method })}
          onPaymentFailed={() => track("payment_failed", { username: normalized })}
          onPaid={(paymentId) => {
            grantReportAccess(normalized, paymentId);
            track("payment_success", { username: normalized });
            navigate({ to: "/report/$username", params: { username: normalized } });
          }}
          onCancel={() => navigate({ to: "/result/$username", params: { username: normalized } })}
        />
      </main>
    </div>
  );
}
