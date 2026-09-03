import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="bg-brand grid size-8 place-items-center rounded-full font-display text-sm font-semibold text-primary-foreground">
            A
          </span>
          <span className="font-display text-[1.05rem] font-semibold tracking-tight">
            Attention Insights
          </span>
        </Link>
        <span className="eyebrow hidden sm:block">Prototype</span>
      </div>
    </header>
  );
}
