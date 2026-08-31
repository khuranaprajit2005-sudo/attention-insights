import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-brand grid size-7 place-items-center rounded-lg text-sm font-bold text-primary-foreground">
            A
          </span>
          <span className="font-display text-base font-bold tracking-tight">AttentionAI</span>
        </Link>
        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Prototype · Demo data
        </span>
      </div>
    </header>
  );
}
