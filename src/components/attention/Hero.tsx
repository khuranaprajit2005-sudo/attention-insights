import { UsernameForm } from "./UsernameForm";

export function Hero({ onSubmit, submitting }: { onSubmit: (u: string) => void; submitting: boolean }) {
  return (
    <section className="px-5 pb-10 pt-12 sm:pt-16">
      <div className="mx-auto w-full max-w-md space-y-7 text-center">
        <span className="chip mx-auto">Social attention analysis</span>

        <div className="space-y-4">
          <h1 className="font-display text-[2.05rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.75rem]">
            Someone is paying <span className="text-gradient">more attention</span> than you think.
          </h1>
          <p className="mx-auto max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
            Enter your username and get a quiet, elegant read on the attention around your profile.
            One minute, no noise.
          </p>
        </div>

        <div className="card-surface rise-in p-5 text-left sm:p-6">
          <UsernameForm onSubmit={onSubmit} submitting={submitting} />
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Prototype using clearly-labelled demo signals. Not affiliated with Instagram or Meta.
        </p>
      </div>
    </section>
  );
}
