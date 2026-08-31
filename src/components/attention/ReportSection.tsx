import type { ReactNode } from "react";

interface Props {
  index: number;
  title: string;
  children: ReactNode;
}

export function ReportSection({ index, title, children }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold">
        <span className="grid size-6 place-items-center rounded-full bg-secondary text-xs text-muted-foreground">
          {index}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
