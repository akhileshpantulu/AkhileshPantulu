"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { projects, projectsVisible, type Project } from "@/content/site";
import { PreviewChart } from "./previews";
import { Reveal } from "./reveal";
import { StackChips } from "./section";
import { shortDate } from "./format";

function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/articles/${p.slug}/`}
      className="liquid-glass group relative block overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-7"
    >
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[5fr_6fr] lg:gap-9">
        <div
          className="relative overflow-hidden rounded-xl border border-border-subtle p-5 transition-colors duration-300 group-hover:border-accent-border/60"
          style={{ background: "rgba(0,0,0,0.42)" }}
        >
          <div className="flex h-[150px] items-center sm:h-[170px]">
            <PreviewChart preview={p.preview} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.18em]">
            <span className="whitespace-nowrap text-fg-dim">Published · {shortDate(p.date)}</span>
            <span className="truncate text-right text-accent">{p.topics}</span>
          </div>
          <h3 className="text-[24px] font-medium leading-[1.15] tracking-[-0.012em] text-fg-bright transition-colors group-hover:text-accent-bright sm:text-[28px]">
            {p.title}
          </h3>
          <p className="text-[14.5px] leading-[1.6] text-fg-muted">{p.summary}</p>
          <div className="mt-1">
            <StackChips items={p.stack} variant="plain" />
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.04em] text-accent transition-colors group-hover:text-accent-bright">
            read article
            <ArrowUpRight size={14} strokeWidth={1.75} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProjectList() {
  const [open, setOpen] = useState(false);
  const sorted = [...projects].sort((a, b) => b.date.localeCompare(a.date));
  const shown = sorted.slice(0, projectsVisible);
  const hidden = sorted.slice(projectsVisible);

  return (
    <div className="flex flex-col gap-4">
      {shown.map((p) => (
        <Reveal key={p.slug}>
          <ProjectCard p={p} />
        </Reveal>
      ))}
      <AnimatePresence initial={false}>
        {open &&
          hidden.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <ProjectCard p={p} />
            </motion.div>
          ))}
      </AnimatePresence>
      {hidden.length > 0 && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="group inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/[0.04] px-5 py-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-fg-muted transition-all hover:-translate-y-0.5 hover:border-accent-border hover:bg-accent-soft hover:text-accent-bright"
          >
            {open ? "Show less" : `View ${hidden.length} more`}
            <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}
