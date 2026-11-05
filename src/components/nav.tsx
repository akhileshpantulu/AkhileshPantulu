"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { nav, site } from "@/content/site";
import { PulseDot } from "./pulse-dot";
import { pad2 } from "./section";

/**
 * Sticky header. Highlights the section currently in view and draws a
 * scroll-progress line along its bottom edge. On article pages pass
 * `home` so the links point back to the homepage anchors.
 */
export function Nav({ home = false }: { home?: boolean }) {
  const [active, setActive] = useState<string>(nav[0]?.id ?? "");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  useEffect(() => {
    if (home) return;
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s.id;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  const prefix = home ? "/" : "";

  return (
    <header
      className="sticky top-0 z-50 border-b border-border-subtle"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,12,14,0.96) 0%, rgba(12,12,14,0.92) 70%, rgba(12,12,14,0.78) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.22) 50%, transparent 100%)" }}
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5 sm:px-8 sm:py-4">
        <a
          href={home ? "/" : "#top"}
          className="group flex items-center gap-2.5 font-mono text-[13px] tracking-[0.2em] text-fg-bright"
        >
          <PulseDot />
          <span>{site.name.toUpperCase()}</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item, i) => {
            const isActive = !home && active === item.id;
            return (
              <a
                key={item.id}
                href={`${prefix}#${item.id}`}
                className="group relative flex items-baseline gap-2 py-1 font-mono text-[14px] tracking-[0.14em] transition-colors"
              >
                <span
                  className={`text-[11px] transition-colors ${isActive ? "text-accent" : "text-fg-dim group-hover:text-accent"}`}
                >
                  {pad2(i + 1)}
                </span>
                <span
                  className={`transition-colors ${isActive ? "text-fg-bright" : "text-fg-muted group-hover:text-fg-bright"}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    style={{ boxShadow: "0 0 8px rgba(34,211,238,0.6)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
