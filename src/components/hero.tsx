import { ArrowDownToLine, Mail } from "lucide-react";
import { site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./brand-icons";

const pill =
  "group inline-flex h-10 items-center justify-center rounded-full border border-border-subtle bg-white/[0.05] text-fg-bright transition-all hover:-translate-y-0.5 hover:border-accent-border hover:bg-accent-soft hover:text-accent-bright";

export function Hero() {
  const { links } = site;
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32">
      <h1 className="text-[clamp(52px,9vw,112px)] font-medium leading-[0.95] tracking-[-0.035em] text-fg-bright">
        {site.name}
      </h1>
      <p className="mt-7 max-w-2xl text-[19px] leading-[1.55] text-fg/85">{site.intro}</p>
      <div className="mt-6 flex items-center gap-2.5">
        <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className={`${pill} w-10`}>
          <GithubIcon />
        </a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className={`${pill} w-10`}>
          <LinkedinIcon />
        </a>
        <a href={`mailto:${links.email}`} aria-label="Email" title={links.email} className={`${pill} w-10`}>
          <Mail size={15} strokeWidth={1.75} />
        </a>
        {links.resume && (
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download resume (PDF)"
            className={`${pill} gap-2 px-4 font-mono text-[11.5px] tracking-[0.16em]`}
          >
            <ArrowDownToLine size={13} strokeWidth={2} />
            RESUME
          </a>
        )}
      </div>
    </section>
  );
}
