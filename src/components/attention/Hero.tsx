import { UsernameForm } from "./UsernameForm";

export function Hero({ onSubmit, submitting }: { onSubmit: (u: string) => void; submitting: boolean }) {
  return (
    <section className="px-4 pb-10 pt-10">
      <div className="mx-auto w-full max-w-md space-y-5 text-center">
        <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          AI Social Attention Analysis
        </span>

        <h1 className="text-gradient font-display text-[2rem] font-bold leading-[1.1] sm:text-4xl">
          KYA TUMHARI EX TUMHE AAJ BHI STALK KARTI HAI? 👀
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base">
          AI-powered social attention analysis se dekho kaun tumhari social presence par sabse zyada
          attention de raha hai.
        </p>

        <UsernameForm onSubmit={onSubmit} submitting={submitting} />

        <p className="text-sm text-foreground/80">
          Get your personalized attention analysis in under a minute.
        </p>
        <p className="text-xs text-muted-foreground">
          Analysis is based on available signals and AI-generated interpretation. AttentionAI is not
          affiliated with any social network.
        </p>
      </div>
    </section>
  );
}
