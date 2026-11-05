import { about } from "@/content/site";
import { Reveal } from "./reveal";
import { pad2 } from "./section";

export function About() {
  return (
    <Reveal y={16} className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
      <div className="flex flex-col gap-5">
        <p className="text-[19px] leading-[1.55] text-fg-bright">{about.greeting}</p>
        {about.paragraphs.map((p) => (
          <p key={p} className="text-[16px] leading-[1.65] text-fg-muted">
            {p}
          </p>
        ))}
      </div>
      <div className="liquid-glass rounded-2xl p-6 sm:p-7">
        <div className="mb-5 flex items-baseline justify-between">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-bright">Quick Facts</h3>
          <span className="font-mono text-[10px] tracking-[0.16em] text-fg-dim">[ {pad2(about.facts.length)} ]</span>
        </div>
        <dl className="flex flex-col divide-y divide-border-subtle">
          {about.facts.map((f) => (
            <div key={f.label} className="grid grid-cols-[100px_1fr] items-center gap-4 py-3 first:pt-0 last:pb-0">
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-dim">{f.label}</dt>
              <dd className="text-[14px] leading-[1.45] text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}
