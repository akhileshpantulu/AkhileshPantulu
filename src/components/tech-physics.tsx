"use client";

import { useEffect, useRef, useState } from "react";
import { tech } from "@/content/site";
import { techIcons } from "./tech-icons";

type Body = { x: number; y: number; vx: number; vy: number; r: number };

const GRAVITY = 1800; // px/s^2
const RESTITUTION = 0.35;
const FRICTION = 0.985;

/**
 * Tech-stack icons as circles in a small physics box. They drop in when
 * the section scrolls into view and can be picked up and thrown.
 */
export function TechPhysics() {
  const boxRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const drag = useRef<{ i: number; dx: number; dy: number; lx: number; ly: number; lt: number } | null>(null);
  const [size, setSize] = useState(72);
  const [hover, setHover] = useState<number | null>(null);
  const [held, setHeld] = useState<number | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let W = box.clientWidth;
    let H = box.clientHeight;
    let S = Math.round(Math.min(84, Math.max(52, W / 6)));
    setSize(S);

    const seed = () => {
      bodies.current = tech.map((_, i) => ({
        x: S / 2 + Math.random() * (W - S),
        y: -S * (1 + i * 0.55) - Math.random() * 40,
        vx: (Math.random() - 0.5) * 120,
        vy: 0,
        r: S / 2,
      }));
    };
    seed();

    const onResize = () => {
      W = box.clientWidth;
      H = box.clientHeight;
      S = Math.round(Math.min(84, Math.max(52, W / 6)));
      setSize(S);
      for (const b of bodies.current) {
        b.r = S / 2;
        b.x = Math.min(Math.max(b.x, b.r), W - b.r);
        b.y = Math.min(b.y, H - b.r);
      }
    };
    window.addEventListener("resize", onResize);

    let running = false;
    let raf = 0;
    let last = 0;

    const step = (dt: number) => {
      const bs = bodies.current;
      const d = drag.current;
      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
        if (d && d.i === i) continue;
        b.vy += GRAVITY * dt;
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }
      for (let iter = 0; iter < 4; iter++) {
        for (let i = 0; i < bs.length; i++) {
          for (let j = i + 1; j < bs.length; j++) {
            const a = bs[i];
            const b = bs[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const min = a.r + b.r;
            const dist2 = dx * dx + dy * dy;
            if (dist2 >= min * min || dist2 === 0) continue;
            const dist = Math.sqrt(dist2);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = min - dist;
            const aFixed = d?.i === i;
            const bFixed = d?.i === j;
            const wa = aFixed ? 0 : bFixed ? 1 : 0.5;
            const wb = bFixed ? 0 : aFixed ? 1 : 0.5;
            a.x -= nx * overlap * wa;
            a.y -= ny * overlap * wa;
            b.x += nx * overlap * wb;
            b.y += ny * overlap * wb;
            const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rel < 0) {
              const imp = -(1 + RESTITUTION) * rel;
              a.vx -= imp * nx * wa;
              a.vy -= imp * ny * wa;
              b.vx += imp * nx * wb;
              b.vy += imp * ny * wb;
            }
          }
        }
        for (let i = 0; i < bs.length; i++) {
          const b = bs[i];
          if (b.x < b.r) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * RESTITUTION;
          } else if (b.x > W - b.r) {
            b.x = W - b.r;
            b.vx = -Math.abs(b.vx) * RESTITUTION;
          }
          if (b.y > H - b.r) {
            b.y = H - b.r;
            b.vy = -Math.abs(b.vy) * RESTITUTION;
            b.vx *= 0.96;
          }
        }
      }
    };

    const render = () => {
      bodies.current.forEach((b, i) => {
        const el = nodeRefs.current[i];
        if (el) el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
      });
    };

    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000 || 0.016);
      last = t;
      step(dt / 2);
      step(dt / 2);
      render();
      if (running) raf = requestAnimationFrame(loop);
    };

    render();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(box);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const local = (e: React.PointerEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = local(e);
    const b = bodies.current[i];
    drag.current = { i, dx: b.x - p.x, dy: b.y - p.y, lx: p.x, ly: p.y, lt: performance.now() };
    b.vx = 0;
    b.vy = 0;
    setHeld(i);
  };

  const onMove = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.i !== i) return;
    const box = boxRef.current!;
    const p = local(e);
    const b = bodies.current[i];
    const now = performance.now();
    const dt = Math.max(1, now - d.lt) / 1000;
    b.x = Math.min(Math.max(p.x + d.dx, b.r), box.clientWidth - b.r);
    b.y = Math.min(Math.max(p.y + d.dy, b.r), box.clientHeight - b.r);
    b.vx = (p.x - d.lx) / dt;
    b.vy = (p.y - d.ly) / dt;
    d.lx = p.x;
    d.ly = p.y;
    d.lt = now;
  };

  const onUp = () => {
    const d = drag.current;
    if (d) {
      const b = bodies.current[d.i];
      const cap = 2400;
      b.vx = Math.max(-cap, Math.min(cap, b.vx));
      b.vy = Math.max(-cap, Math.min(cap, b.vy));
    }
    drag.current = null;
    setHeld(null);
  };

  const iconSize = Math.round(size * 0.86);

  return (
    <div
      className="relative h-[460px] overflow-hidden border border-neutral-200 bg-neutral-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute left-4 top-3 z-20 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        drag to pick up
      </div>
      <div ref={boxRef} className="relative h-full w-full select-none" style={{ touchAction: "none" }}>
        {tech.map((t, i) => {
          const Icon = techIcons[t.icon] ?? techIcons.database;
          const showLabel = hover === i || held === i;
          return (
            <div
              key={t.name}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              aria-label={t.name}
              onPointerDown={onDown(i)}
              onPointerMove={onMove(i)}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover((h) => (h === i ? null : h))}
              className="absolute left-0 top-0 flex items-center justify-center"
              style={{
                width: size,
                height: size,
                transform: "translate3d(-200px,-200px,0)",
                willChange: "transform",
                cursor: held === i ? "grabbing" : "grab",
                color: t.color,
                zIndex: held === i ? 30 : showLabel ? 20 : 1,
              }}
            >
              <div
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-2.5 py-1 text-xs font-semibold text-white transition-opacity duration-150"
                style={{
                  bottom: "calc(100% + 6px)",
                  opacity: showLabel ? 1 : 0,
                }}
              >
                {t.name}
              </div>
              <div
                className="flex items-center justify-center transition-[transform,filter] duration-150 ease-out"
                style={{
                  transform: `scale(${held === i ? 1.12 : hover === i ? 1.05 : 1})`,
                  filter: `drop-shadow(0 ${held === i ? 10 : 3}px ${held === i ? 16 : 6}px rgba(0,0,0,${held === i ? 0.3 : 0.15}))`,
                }}
              >
                <Icon size={iconSize} />
              </div>
            </div>
          );
        })}
      </div>
      <ul className="sr-only">
        {tech.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
