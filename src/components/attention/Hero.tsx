import { UsernameForm } from "./UsernameForm";

export function Hero({ onSubmit, submitting }: { onSubmit: (u: string) => void; submitting: boolean }) {
  return (
    <section className="px-4 pb-12 pt-10 sm:pt-14">
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          AI Social Attention Analysis
        </span>

        <h1 className="text-gradient font-display text-[1.95rem] font-bold leading-[1.12] sm:text-[2.6rem]">
          Kya tumhari EX tumhe aaj bhi stalk karti hai? 👀
        </h1>

        <p className="mx-auto max-w-sm text-sm text-muted-foreground sm:text-base">
          Discover your social attention patterns with AI-powered analysis. Your score in under a
          minute.
        </p>

        <div className="card-surface animate-fade-in p-5 sm:p-6">
          <UsernameForm onSubmit={onSubmit} submitting={submitting} />
        </div>

        <p className="text-xs text-muted-foreground">
          Analysis is based on available signals and AI-generated interpretation. AttentionAI is not
          affiliated with Instagram or Meta.
        </p>
      </div>
    </section>
  );
}
