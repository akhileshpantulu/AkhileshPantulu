"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { about, contact, home, projects, site, type Credit, type Panel } from "@/content/site";
import { longDate } from "./format";

type Menu = null | "projects" | "links" | "mobile";
type Drawer = null | { kind: Panel } | { kind: "project"; slug: string };

const DEFAULT_ASPECT = 16 / 9;
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ----------------------------------------------------------------- */
/* Loader: white screen with the name, shown once per browser session */
/* ----------------------------------------------------------------- */

function Loader() {
  const [state, setState] = useState<"show" | "fade" | "gone">("show");
  useIsoLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("loaded") === "1";
      sessionStorage.setItem("loaded", "1");
    } catch {}
    if (seen) {
      setState("gone");
      return;
    }
    const a = setTimeout(() => setState("fade"), 900);
    const b = setTimeout(() => setState("gone"), 1900);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  if (state === "gone") return null;
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-white text-black transition-opacity duration-1000"
      style={{ opacity: state === "fade" ? 0 : 1 }}
    >
      <h2 className="text-lg font-semibold">{site.name}</h2>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Artwork: the homepage image, fit whole inside the screen           */
/* ----------------------------------------------------------------- */

function Artwork({ dimmed }: { dimmed: boolean }) {
  const img = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);
  const [failed, setFailed] = useState(false);

  // The image can finish (or fail) before React hydrates, so check once on mount.
  useEffect(() => {
    const el = img.current;
    if (el?.complete) {
      if (el.naturalWidth === 0) setFailed(true);
      else setAspect(el.naturalWidth / el.naturalHeight);
    }
    const t = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useIsoLayoutEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Leave space for the header above and the credit / corner buttons below.
      const md = vw >= 768;
      const short = !md && vh < 500; // phone held sideways
      const top = md ? 72 : short ? 48 : 84;
      const bottom = md ? 72 : short ? 64 : 128;
      const side = md ? 24 : 16;
      const aw = vw - side * 2;
      const ah = Math.max(120, vh - top - bottom);
      const w = Math.min(aw, ah * aspect);
      const h = w / aspect;
      setBox({ w, h, x: (vw - w) / 2, y: top + (ah - h) / 2 });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [aspect]);

  const alt = home.credit ? `${home.credit.title} by ${home.credit.artist}` : "";

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      style={{
        filter: dimmed ? "blur(10px) brightness(0.55)" : revealed ? "blur(0px)" : "blur(25px)",
        transition: "filter 1s cubic-bezier(.165,.84,.44,1)",
      }}
    >
      {!failed && (
        <div
          className="relative"
          style={box ? { width: box.w, height: box.h, marginLeft: box.x, marginTop: box.y } : { visibility: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={img}
            src={home.image}
            alt={alt}
            onLoad={(e) => setAspect(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
            onError={() => setFailed(true)}
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Left menu panels                                                   */
/* ----------------------------------------------------------------- */

function MenuList({ items, open, align = "start" }: { items: React.ReactNode[]; open: boolean; align?: "start" | "end" }) {
  return (
    <ul className={`flex flex-col gap-1 ${align === "end" ? "items-end text-right" : ""}`}>
      {items.map((node, i) => (
        <li
          key={i}
          className="text-2xl font-bold leading-tight transition-[opacity,transform] duration-1000 ease-in-out"
          style={{
            transitionDelay: open ? `${250 + i * 50}ms` : "0ms",
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateX(-10px)",
          }}
        >
          {node}
        </li>
      ))}
    </ul>
  );
}

function linkItems() {
  const l = site.links;
  const items: [string, string][] = [
    ["LinkedIn", l.linkedin],
    ["Email", `mailto:${l.email}`],
  ];
  if (l.resume) items.push(["Résumé", l.resume]);
  return items;
}

/* ----------------------------------------------------------------- */
/* Drawer content                                                     */
/* ----------------------------------------------------------------- */

function DrawerBody({ drawer, openProject }: { drawer: Exclude<Drawer, null>; openProject: (slug: string) => void }) {
  if (drawer.kind === "about") {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-xl font-bold">{about.greeting}</p>
        {about.paragraphs.map((p) => (
          <p key={p} className="leading-relaxed text-neutral-700">
            {p}
          </p>
        ))}
        <dl className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
          {about.facts.map((f) => (
            <div key={f.label} className="grid grid-cols-[110px_1fr] gap-4 py-3 text-sm">
              <dt className="font-semibold">{f.label}</dt>
              <dd className="text-neutral-700">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (drawer.kind === "contact") {
    return (
      <div className="flex flex-col gap-6">
        <p className="leading-relaxed text-neutral-700">{contact.blurb}</p>
        <ul className="flex flex-col gap-2 text-2xl font-bold">
          {linkItems().map(([label, href]) => (
            <li key={label}>
              <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="hover:opacity-50">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (drawer.kind !== "project") return null;
  const slug = (drawer as { slug: string }).slug;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {longDate(p.date)} · {p.topics}
      </div>
      <h3 className="text-3xl font-bold leading-tight">{p.title}</h3>
      <p className="leading-relaxed text-neutral-700">{p.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <span key={s} className="border border-black px-2 py-0.5 text-xs font-semibold">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Link href={`/articles/${p.slug}/`} className="block bg-black px-4 py-3 text-center font-semibold text-white hover:opacity-80">
          Read the write-up
        </Link>
        {p.link && (
          <a href={p.link.url} target="_blank" rel="noopener noreferrer" className="block border border-black px-4 py-3 text-center font-semibold hover:bg-black hover:text-white">
            {p.link.label}
          </a>
        )}
      </div>
      {projects.length > 1 && (
        <button type="button" onClick={() => openProject(next.slug)} className="mt-4 self-start text-sm font-semibold underline-offset-4 hover:underline">
          Next: {next.title} →
        </button>
      )}
    </div>
  );
}

const drawerTitle = (d: Exclude<Drawer, null>) =>
  d.kind === "about" ? "About" : d.kind === "contact" ? "Contact" : "Project";

function CreditText({ c }: { c: Credit }) {
  return (
    <>
      <span className="italic">{c.title}</span>, {c.artist}, {c.year} · {c.museum}
    </>
  );
}

/* ----------------------------------------------------------------- */
/* The whole page                                                     */
/* ----------------------------------------------------------------- */

export function Experience() {
  const [menu, setMenu] = useState<Menu>(null);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [lastDrawer, setLastDrawer] = useState<Exclude<Drawer, null> | null>(null);

  const openDrawer = useCallback((d: Exclude<Drawer, null>) => {
    setMenu(null);
    setDrawer(d);
    setLastDrawer(d);
  }, []);
  const closeAll = useCallback(() => {
    setMenu(null);
    setDrawer(null);
  }, []);
  const toggle = (m: Exclude<Menu, null>) => {
    setDrawer(null);
    setMenu((cur) => (cur === m ? null : m));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  const projectItems = projects.map((p) => (
    <button key={p.slug} type="button" className="text-left hover:opacity-50" onClick={() => openDrawer({ kind: "project", slug: p.slug })}>
      {p.title}
    </button>
  ));
  const links = linkItems().map(([label, href]) => (
    <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="hover:opacity-50">
      {label}
    </a>
  ));

  const anyOpen = menu !== null || drawer !== null;
  const btn = "px-2.5 text-base font-semibold transition-opacity duration-300 hover:opacity-60";
  const shown = drawer ?? lastDrawer;

  return (
    <>
      <Loader />
      <Artwork dimmed={anyOpen} />

      {/* click-away layer */}
      {anyOpen && <button type="button" aria-label="Close" className="fixed inset-0 z-30 cursor-default" onClick={closeAll} />}

      {/* Credit tag for the artwork */}
      {home.credit && (
        <div className="pointer-events-auto fixed bottom-[76px] left-1/2 z-40 [@media(max-height:500px)]:bottom-8 w-max max-w-[calc(100vw-48px)] [@media(max-height:500px)]:max-w-[calc(100vw-240px)] -translate-x-1/2 text-balance text-center leading-snug text-xs text-white/80 [text-shadow:0_0_8px_rgba(0,0,0,0.6)] md:bottom-7">
          {home.credit.url ? (
            <a href={home.credit.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <CreditText c={home.credit} />
            </a>
          ) : (
            <CreditText c={home.credit} />
          )}
        </div>
      )}

      {/* Header */}
      <header className="pointer-events-none fixed inset-0 z-40 text-white [text-shadow:0_0_12px_rgba(0,0,0,0.45)]">
        {/* desktop top bar */}
        <div className="pointer-events-auto absolute inset-x-6 top-0 hidden h-[72px] items-center justify-between md:flex">
          <nav className="flex items-center gap-7">
            <button type="button" className={btn} aria-expanded={menu === "projects"} onClick={() => toggle("projects")}>
              Projects
            </button>
            <button type="button" className={btn} onClick={() => openDrawer({ kind: "about" })}>
              About
            </button>
          </nav>
          <h1 className="absolute left-1/2 -translate-x-1/2 font-bold">
            <Link href="/">{site.name}</Link>
          </h1>
          <button type="button" className={btn} onClick={() => openDrawer({ kind: "contact" })}>
            Contact
          </button>
        </div>
        {/* desktop corners */}
        <button type="button" className={`${btn} pointer-events-auto fixed bottom-6 right-6 hidden md:block`} aria-expanded={menu === "links"} aria-label="Links" onClick={() => toggle("links")}>
          ®
        </button>

        {/* mobile */}
        <h1 className="pointer-events-auto fixed left-1/2 top-10 -translate-x-1/2 whitespace-nowrap font-bold md:hidden [@media(max-height:500px)]:top-3">
          <Link href="/">{site.name}</Link>
        </h1>
        <div className="pointer-events-auto fixed inset-x-6 bottom-6 flex items-center justify-between md:hidden">
          <button type="button" className="h-8 border border-neutral-300 px-2 font-bold text-neutral-300" aria-expanded={menu === "mobile"} onClick={() => toggle("mobile")}>
            {menu === "mobile" ? "Close" : "Menu"}
          </button>
          <button type="button" className="h-8 border border-neutral-300 px-2 font-bold text-neutral-300" onClick={() => openDrawer({ kind: "contact" })}>
            Contact
          </button>
        </div>
      </header>

      {/* Left panel: projects / mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!(menu === "projects" || menu === "mobile")}
        className="fixed bottom-0 left-0 top-0 z-[45] w-[calc(100vw-120px)] max-w-[353px] text-white transition-all duration-500 ease-[cubic-bezier(.165,.84,.44,1)]"
        style={{
          visibility: menu === "projects" || menu === "mobile" ? "visible" : "hidden",
          transform: menu === "projects" || menu === "mobile" ? "none" : "translateX(-100%)",
        }}
      >
        <div className={`scrollbar-hidden absolute inset-0 overflow-y-auto px-6 pb-24 pt-28 ${menu === "projects" ? "" : "pointer-events-none opacity-0"}`}>
          <MenuList open={menu === "projects"} items={projectItems} />
        </div>
        <div className={`scrollbar-hidden absolute inset-0 overflow-y-auto px-6 pb-24 pt-28 ${menu === "mobile" ? "" : "pointer-events-none opacity-0"}`}>
          <h3 className="mb-3 font-bold opacity-60">Projects</h3>
          <MenuList open={menu === "mobile"} items={projectItems} />
          <h3 className="mb-3 mt-8 font-bold opacity-60">More</h3>
          <MenuList
            open={menu === "mobile"}
            items={[
              <button key="a" type="button" className="hover:opacity-50" onClick={() => openDrawer({ kind: "about" })}>
                About
              </button>,
              ...links,
            ]}
          />
        </div>
      </div>

      {/* Right corner panel: links */}
      <div
        className="fixed bottom-16 right-6 z-[45] hidden text-white transition-[visibility] md:block"
        style={{ visibility: menu === "links" ? "visible" : "hidden" }}
        aria-hidden={menu !== "links"}
      >
        <ul className="flex flex-col items-end gap-1 text-base font-bold">
          {links.map((node, i) => (
            <li
              key={i}
              className="transition-[opacity,transform] duration-700 ease-in-out"
              style={{ transitionDelay: menu === "links" ? `${150 + i * 50}ms` : "0ms", opacity: menu === "links" ? 1 : 0, transform: menu === "links" ? "none" : "translateY(6px)" }}
            >
              {node}
            </li>
          ))}
        </ul>
      </div>

      {/* Right drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={shown ? drawerTitle(shown) : "Panel"}
        aria-hidden={!drawer}
        className="fixed bottom-0 top-0 z-50 flex w-[92vw] max-w-md flex-col bg-white text-black shadow-2xl shadow-neutral-900 transition-[right,visibility] duration-700 ease-[cubic-bezier(.165,.84,.44,1)] md:w-2/5"
        style={{ right: drawer ? 0 : "-110%", visibility: drawer ? "visible" : "hidden" }}
      >
        <div className="flex h-[72px] flex-none items-center justify-between border-b border-black px-6">
          <span className="font-semibold">{shown ? drawerTitle(shown) : ""}</span>
          <button type="button" className="font-semibold hover:opacity-50" onClick={() => setDrawer(null)}>
            Close
          </button>
        </div>
        <div className="scrollbar-hidden flex-1 overflow-y-auto px-6 py-8">
          {shown && <DrawerBody drawer={shown} openProject={(slug) => openDrawer({ kind: "project", slug })} />}
        </div>
      </aside>
    </>
  );
}
