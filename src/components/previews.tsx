"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

/**
 * Small animated charts shown on project cards. Pick a `kind` in
 * src/content/site.ts and supply the data; animation runs on scroll-in.
 */
export type Preview =
  | {
      kind: "leaderboard";
      title: string;
      rows: { label: string; tag?: string; value: number }[];
      max?: number; // value that fills the bar, default 100
    }
  | {
      kind: "bars";
      title: string;
      rows: { label: string; value: number; suffix?: string; tone?: "good" | "bad" | "accent" }[];
      footer?: { label: string; value: string }[];
    }
  | {
      kind: "sparkline";
      title: string;
      points: number[];
      startLabel: string;
      endLabel: string;
      yLabel: string;
      suffix?: string;
    }
  | {
      kind: "hbars";
      title: string;
      rows: { label: string; value: number }[];
      suffix?: string;
    }
  | {
      kind: "columns";
      title: string;
      columns: { label: string; value: number; showValue?: boolean }[];
      suffix?: string;
    };

const EASE = [0.22, 1, 0.36, 1] as const;
const TONES = { good: "#34d399", bad: "#f87171", accent: "#22d3ee" };
const MONO = "var(--font-mono), monospace";

function gradeColor(v: number) {
  if (v >= 90) return "#34d399";
  if (v >= 80) return "#4ade80";
  if (v >= 70) return "#a3e635";
  if (v >= 60) return "#facc15";
  return "#fb923c";
}

function Header({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
      <span>{title}</span>
      <span className="text-accent">●</span>
    </div>
  );
}

function Bar({ pct, color, inView, delay }: { pct: number; color: string; inView: boolean; delay: number }) {
  return (
    <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/[0.04]">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: inView ? `${Math.min(100, Math.max(0, pct))}%` : 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      />
    </div>
  );
}

/** Panel wrapper used by flagship cards (dark inset box with a header). */
export function PreviewPanel({ preview }: { preview: Preview }) {
  return (
    <div
      className="relative rounded-xl border border-border-subtle p-5 transition-colors duration-300 group-hover:border-accent-border/60 sm:p-6"
      style={{ background: "rgba(0,0,0,0.42)" }}
    >
      <PreviewChart preview={preview} withHeader />
    </div>
  );
}

export function PreviewChart({ preview, withHeader = false }: { preview: Preview; withHeader?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="w-full">
      {withHeader && (preview.kind === "leaderboard" || preview.kind === "bars") && <Header title={preview.title} />}
      {preview.kind === "leaderboard" && <Leaderboard p={preview} inView={inView} />}
      {preview.kind === "bars" && <Bars p={preview} inView={inView} />}
      {preview.kind === "sparkline" && <Sparkline p={preview} inView={inView} />}
      {preview.kind === "hbars" && <HBars p={preview} inView={inView} />}
      {preview.kind === "columns" && <Columns p={preview} inView={inView} />}
    </div>
  );
}

function Leaderboard({ p, inView }: { p: Extract<Preview, { kind: "leaderboard" }>; inView: boolean }) {
  const max = p.max ?? 100;
  return (
    <div className="flex flex-col gap-3.5">
      {p.rows.map((r, i) => {
        const color = gradeColor((r.value / max) * 100);
        return (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <div className="flex items-baseline gap-3">
              <span className="w-5 font-mono text-[10px] tabular-nums text-fg-dim">{i + 1}</span>
              <span className="flex-1 truncate text-[13px] text-fg">{r.label}</span>
              {r.tag && <span className="font-mono text-[10px] tracking-[0.08em] text-fg-dim">{r.tag}</span>}
              <span className="w-12 text-right font-mono text-[12px] font-medium tabular-nums" style={{ color }}>
                {r.value.toFixed(1)}
              </span>
            </div>
            <Bar pct={(r.value / max) * 100} color={color} inView={inView} delay={0.15 + i * 0.08} />
          </motion.div>
        );
      })}
    </div>
  );
}

function Bars({ p, inView }: { p: Extract<Preview, { kind: "bars" }>; inView: boolean }) {
  const max = Math.max(...p.rows.map((r) => r.value), 1);
  return (
    <>
      <div className="flex flex-col gap-4">
        {p.rows.map((r, i) => {
          const color = TONES[r.tone ?? "accent"];
          return (
            <div key={r.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-[12.5px] text-fg">{r.label}</span>
                <span className="font-mono text-[12px] font-medium tabular-nums" style={{ color }}>
                  {r.value}
                  {r.suffix}
                </span>
              </div>
              <Bar pct={(r.value / max) * 100} color={color} inView={inView} delay={0.1 + i * 0.1} />
            </div>
          );
        })}
      </div>
      {p.footer && (
        <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border-subtle pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">
          {p.footer.map((f) => (
            <span key={f.label}>
              {f.label} <span className="text-fg-bright">{f.value}</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

const VB = { w: 320, h: 88 };

function Sparkline({ p, inView }: { p: Extract<Preview, { kind: "sparkline" }>; inView: boolean }) {
  const x0 = 22;
  const x1 = 312;
  const yTop = 14;
  const yBot = 66;
  const min = Math.min(...p.points);
  const max = Math.max(...p.points);
  const span = max - min || 1;
  const pts = p.points.map((v, i) => {
    const x = x0 + (i / Math.max(1, p.points.length - 1)) * (x1 - x0);
    const y = yBot - ((v - min) / span) * (yBot - yTop);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `M ${x0},70 L ${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")} L ${x1},70 Z`;
  const last = pts[pts.length - 1];
  const first = p.points[0];
  const lastV = p.points[p.points.length - 1];
  const sfx = p.suffix ?? "";
  const id = `spark-${p.title.replace(/\W/g, "")}`;

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={`${p.title}: ${first}${sfx} to ${lastV}${sfx}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 40, 55].map((y) => (
        <line key={y} x1={x0} x2={x1} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" />
      ))}
      <motion.path d={area} fill={`url(#${id})`} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.9 }} />
      <motion.path
        d={line}
        fill="none"
        stroke="#22d3ee"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <motion.circle cx={last[0]} cy={last[1]} r={2.5} fill="#67e8f9" initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 1.3 }} />
      <motion.text x={last[0] - 6} y={last[1] - 4} textAnchor="end" fill="rgba(103,232,249,0.9)" fontSize={9} fontFamily={MONO} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 1.4 }}>
        {lastV}
        {sfx}
      </motion.text>
      <motion.text x={x0 + 4} y={pts[0][1] - 6} fill="rgba(139,138,131,0.7)" fontSize={9} fontFamily={MONO} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 0.4 }}>
        {first}
        {sfx}
      </motion.text>
      <text x={10} y={40} textAnchor="middle" transform="rotate(-90, 10, 40)" fill="rgba(139,138,131,0.65)" fontSize={8} fontFamily={MONO} letterSpacing="0.18em">
        {p.yLabel}
      </text>
      <text x={x0} y={84} fill="rgba(139,138,131,0.6)" fontSize={8} fontFamily={MONO} letterSpacing="0.1em">
        {p.startLabel}
      </text>
      <text x={x1} y={84} textAnchor="end" fill="rgba(139,138,131,0.6)" fontSize={8} fontFamily={MONO} letterSpacing="0.1em">
        {p.endLabel}
      </text>
    </svg>
  );
}

function HBars({ p, inView }: { p: Extract<Preview, { kind: "hbars" }>; inView: boolean }) {
  const x0 = 78;
  const full = 206;
  const rowH = 25;
  const sfx = p.suffix ?? "";
  const n = p.rows.length;
  const top = (VB.h - 16 - n * rowH) / 2 + 8;
  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={`${p.title}: ${p.rows.map((r) => `${r.label} ${r.value}${sfx}`).join(", ")}`}>
      {p.rows.map((r, i) => {
        const y = top + i * rowH;
        const w = (Math.min(100, r.value) / 100) * full;
        const alpha = 0.55 + (i / Math.max(1, n - 1)) * 0.4;
        return (
          <g key={r.label}>
            <text x={x0 - 6} y={y + 9} textAnchor="end" fill="rgba(139,138,131,0.75)" fontSize={8} fontFamily={MONO} letterSpacing="0.06em">
              {r.label}
            </text>
            <rect x={x0} y={y} width={full} height={12} rx={2.5} fill="rgba(255,255,255,0.035)" />
            <motion.rect x={x0} y={y} height={12} rx={2.5} fill={`rgba(34,211,238,${alpha})`} initial={{ width: 0 }} animate={{ width: inView ? w : 0 }} transition={{ duration: 1, delay: 0.15 + i * 0.15, ease: EASE }} />
            <motion.text x={x0 + w + 4} y={y + 9} fontSize={9} fill="rgba(103,232,249,0.9)" fontFamily={MONO} fontWeight={500} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 0.9 + i * 0.15 }}>
              {r.value}
              {sfx}
            </motion.text>
          </g>
        );
      })}
      <text x={181} y={84} textAnchor="middle" fill="rgba(139,138,131,0.65)" fontSize={8} fontFamily={MONO} letterSpacing="0.18em">
        {p.title}
      </text>
    </svg>
  );
}

function Columns({ p, inView }: { p: Extract<Preview, { kind: "columns" }>; inView: boolean }) {
  const x0 = 30;
  const x1 = 308;
  const base = 72;
  const maxH = 58;
  const n = p.columns.length;
  const slot = (x1 - x0) / n;
  const bw = slot * 0.5;
  const max = Math.max(...p.columns.map((c) => c.value), 1);
  const sfx = p.suffix ?? "";
  const id = `cols-${p.title.replace(/\W/g, "")}`;
  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={`${p.title}: ${p.columns.map((c) => `${c.label} ${c.value}${sfx}`).join(", ")}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <line x1={x0} y1={base} x2={x1} y2={base} stroke="rgba(255,255,255,0.12)" />
      {p.columns.map((c, i) => {
        const cx = x0 + slot * i + slot / 2;
        const h = Math.max(1.5, (c.value / max) * maxH);
        return (
          <g key={c.label}>
            <motion.rect x={cx - bw / 2} width={bw} rx={1.5} fill={`url(#${id})`} initial={{ height: 0, y: base }} animate={inView ? { height: h, y: base - h } : { height: 0, y: base }} transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }} />
            {c.showValue && (
              <motion.text x={cx} y={base - h - 4} textAnchor="middle" fill="rgba(103,232,249,0.95)" fontSize={9} fontFamily={MONO} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 0.8 + i * 0.12 }}>
                {c.value}
                {sfx}
              </motion.text>
            )}
            <text x={cx} y={84} textAnchor="middle" fill="rgba(139,138,131,0.65)" fontSize={7.5} fontFamily={MONO} letterSpacing="0.06em">
              {c.label}
            </text>
          </g>
        );
      })}
      <text x={10} y={44} textAnchor="middle" transform="rotate(-90, 10, 44)" fill="rgba(139,138,131,0.65)" fontSize={8} fontFamily={MONO} letterSpacing="0.18em">
        {p.title}
      </text>
    </svg>
  );
}
