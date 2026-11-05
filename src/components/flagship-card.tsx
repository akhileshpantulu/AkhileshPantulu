import { ArrowUpRight } from "lucide-react";
import type { Flagship } from "@/content/site";
import { PreviewPanel } from "./previews";
import { PulseDot } from "./pulse-dot";
import { Reveal } from "./reveal";
import { StackChips } from "./section";

export function FlagshipCard({ item }: { item: Flagship }) {
  const host = item.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <Reveal>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="liquid-glass-accent group relative block overflow-hidden rounded-2xl p-6 sm:p-8"
      >
        <div className="mb-7 flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-accent-border bg-accent-soft px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-bright">
            <PulseDot opacity={0.6} />
            {item.status ?? "Flagship — Live"}
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] text-accent-bright transition-colors group-hover:text-fg-bright">
            {host}
            <ArrowUpRight size={13} strokeWidth={1.75} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <PreviewPanel preview={item.preview} />
          <div className="flex flex-col gap-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-muted">{item.category}</div>
            <h3 className="text-[26px] font-medium leading-[1.1] tracking-[-0.012em] text-fg-bright sm:text-[30px]">{item.title}</h3>
            <p className="text-[14.5px] leading-[1.6] text-fg-muted">{item.description}</p>
            <div className="mt-2">
              <StackChips items={item.stack} />
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.04em] text-accent transition-colors group-hover:text-accent-bright">
              visit the site
              <ArrowUpRight size={14} strokeWidth={1.75} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </a>
    </Reveal>
  );
}
