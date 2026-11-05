import { ArrowDownToLine, ArrowUpRight, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { contact, site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { Reveal } from "./reveal";

function Row({ href, label, value, icon, external, delay }: { href: string; label: string; value: string; icon: ReactNode; external?: boolean; delay: number }) {
  return (
    <Reveal y={12} delay={delay}>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="liquid-glass group flex items-center gap-4 rounded-xl p-4 sm:p-5"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-white/[0.025] text-fg-muted transition-colors group-hover:border-accent-border group-hover:bg-accent-soft group-hover:text-accent-bright">
          {icon}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">{label}</span>
          <span className="truncate font-mono text-[13.5px] tracking-[0.01em] text-fg transition-colors group-hover:text-fg-bright">{value}</span>
        </div>
        <ArrowUpRight size={15} strokeWidth={1.75} className="flex-shrink-0 text-fg-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
      </a>
    </Reveal>
  );
}

export function Contact() {
  const { links } = site;
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <Reveal y={16} className="flex flex-col gap-6">
        <h3 className="text-[clamp(36px,5vw,52px)] font-medium leading-[1.05] tracking-[-0.025em] text-fg-bright">
          {contact.headline} <span className="text-accent-bright">{contact.headlineAccent}</span>
        </h3>
        <p className="max-w-xl text-[16px] leading-[1.6] text-fg-muted">{contact.blurb}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a
            href={`mailto:${links.email}`}
            className="group inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-soft px-4 py-2.5 font-mono text-[12px] tracking-[0.14em] text-accent-bright transition-all hover:border-accent hover:bg-accent/10"
          >
            <Mail size={14} strokeWidth={2} />
            <span>get in touch</span>
            <ArrowUpRight size={13} strokeWidth={2} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          {links.resume && (
            <a
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.05] px-4 py-2.5 font-mono text-[12px] tracking-[0.14em] text-fg-bright transition-all hover:border-fg-muted hover:text-accent-bright"
            >
              <ArrowDownToLine size={13} strokeWidth={2} className="transition-transform group-hover:translate-y-0.5" />
              <span>resume.pdf</span>
            </a>
          )}
        </div>
      </Reveal>
      <div className="flex flex-col gap-2.5">
        <Row href={`mailto:${links.email}`} label="Email" value={links.email} icon={<Mail size={15} strokeWidth={1.75} />} delay={0} />
        <Row href={links.linkedin} label="LinkedIn" value={links.linkedinLabel} icon={<LinkedinIcon />} external delay={0.08} />
        <Row href={links.github} label="GitHub" value={links.githubLabel} icon={<GithubIcon />} external delay={0.16} />
      </div>
    </div>
  );
}
