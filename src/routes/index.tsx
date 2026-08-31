import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/attention/Header";
import { Hero } from "@/components/attention/Hero";
import { track } from "@/lib/analytics";

// DEMO CONTENT — prototype-only social proof. Remove before production.
const DEMO_SOCIAL_PROOF = {
  count: "12,400+ analyses completed",
  testimonials: [
    { name: "Riya S.", text: "Bahut accurate lagta hai 😭 mere friends ne bhi try kiya." },
    { name: "Aman K.", text: "₹99 mein itna detailed report — timepass se zyada mazaa aaya." },
    { name: "Nikita P.", text: "Score dekh ke poora group chat hil gaya 🔥" },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AttentionAI — AI Social Attention Score in 60 Seconds" },
      {
        name: "description",
        content:
          "Enter your username and get an AI-powered social attention analysis: attention score, signals and momentum. Demo prototype, no password needed.",
      },
      { property: "og:title", content: "AttentionAI — Kaun de raha hai tumhe attention? 👀" },
      {
        property: "og:description",
        content: "AI-powered social attention analysis. Username only, no password.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    track("landing_view");
  }, []);

  function handleSubmit(username: string) {
    setSubmitting(true);
    track("username_submitted", { username });
    navigate({ to: "/analyze/$username", params: { username } });
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-3xl pb-16">
        <Hero onSubmit={handleSubmit} submitting={submitting} />

        <section className="space-y-4 px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground">
            {DEMO_SOCIAL_PROOF.count}{" "}
            <span className="text-[10px] uppercase tracking-wider">(demo data)</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {DEMO_SOCIAL_PROOF.testimonials.map((t) => (
              <figure key={t.name} className="card-surface p-4">
                <blockquote className="text-sm">"{t.text}"</blockquote>
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  — {t.name} · fictional demo reviewer
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-10 px-4">
          <div className="card-surface space-y-2 p-5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">How it works</p>
            <p>
              AttentionAI runs a deterministic scoring model over available signals and adds an AI
              interpretation layer. This prototype uses clearly-labelled demo data only.
            </p>
            <p>
              We never ask for passwords, never access private profile-visit history, and are not
              affiliated with Instagram or Meta.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
