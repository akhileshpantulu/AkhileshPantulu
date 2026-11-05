import type { ReactNode } from "react";

export function Section({
  id,
  index,
  title,
  meta,
  children,
}: {
  id: string;
  index: string;
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-8 sm:px-8 sm:py-12">
      <div className="mb-6 flex items-baseline gap-4 border-b border-border-subtle pb-3">
        <span className="font-mono text-[12px] tracking-[0.22em] text-accent">/ {index}</span>
        <h2 className="text-[22px] font-medium tracking-[-0.005em] text-fg-bright">{title}</h2>
        <span className="ml-auto font-mono text-[11.5px] tracking-[0.14em] text-fg-dim">{meta}</span>
      </div>
      {children}
    </section>
  );
}

export function StackChips({ items, variant = "surface" }: { items: string[]; variant?: "surface" | "plain" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <span
          key={s}
          className={`rounded-md border border-border-subtle px-2.5 py-1 font-mono text-[11.5px] text-fg ${
            variant === "surface" ? "bg-surface" : "bg-white/[0.04]"
          }`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
