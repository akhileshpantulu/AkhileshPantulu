"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { about, books, gallery, home, misc, pageArt, projects, site, type Credit } from "@/content/site";
import { longDate } from "./format";

type Menu = null | "projects" | "about" | "contact" | "links" | "mobile";
type Drawer = null | { kind: "misc" } | { kind: "project"; slug: string };
type Page = "about" | "books" | "art";
type TextPage = "about" | "books";
type Art = { image: string; credit: Credit | null };

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

function Artwork({ dimmed, art, coverOnMobile = false }: { dimmed: boolean; art: Art; coverOnMobile?: boolean }) {
  const img = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);
  const [failed, setFailed] = useState(false);
  // Animate size changes only when switching between fill and fit (phone
  // Hide/Show), never while the window is being resized.
  const [animating, setAnimating] = useState(false);
  const firstMode = useRef(true);
  useEffect(() => {
    if (firstMode.current) {
      firstMode.current = false;
      return;
    }
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 750);
    return () => clearTimeout(t);
  }, [coverOnMobile]);

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
      const md = vw >= 768;
      // On phones, pages with text over the art fill the screen behind the text.
      if (coverOnMobile && !md) {
        const w = Math.max(vw, vh * aspect);
        const h = w / aspect;
        setBox({ w, h, x: (vw - w) / 2, y: (vh - h) / 2 });
        return;
      }
      // Leave space for the header above and the credit / corner buttons below.
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
  }, [aspect, coverOnMobile]);

  const alt = art.credit ? `${art.credit.title} by ${art.credit.artist}` : "";

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
          style={
            box
              ? { width: box.w, height: box.h, marginLeft: box.x, marginTop: box.y, transition: animating ? "all 0.7s cubic-bezier(.165,.84,.44,1)" : undefined }
              : { visibility: "hidden" }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={img}
            src={art.image}
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
  if (drawer.kind === "misc") {
    return (
      <ul className="flex flex-col gap-6">
        {misc.map((m) => (
          <li key={m.title}>
            <div className="text-lg font-bold leading-tight">
              {m.url ? (
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-50">
                  {m.title}
                </a>
              ) : (
                m.title
              )}
            </div>
            <p className="mt-1 leading-relaxed text-neutral-700">{m.text}</p>
          </li>
        ))}
      </ul>
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
  d.kind === "misc" ? "Misc" : "Project";

function CreditText({ c }: { c: Credit }) {
  return (
    <>
      <span className="italic">{c.title}</span>, {c.artist}, {c.year} · {c.museum}
    </>
  );
}

/** Small right-aligned list of contact links that fades in item by item. */
function LinksList({ open, links, className, from }: { open: boolean; links: React.ReactNode[]; className: string; from: "above" | "below" }) {
  return (
    <div className={`fixed z-[45] text-white [text-shadow:0_0_12px_rgba(0,0,0,0.45)] ${className}`} style={{ visibility: open ? "visible" : "hidden" }} aria-hidden={!open}>
      <ul className="flex flex-col items-end gap-1 px-2.5 text-base font-bold">
        {links.map((node, i) => (
          <li
            key={i}
            className="transition-[opacity,transform] duration-700 ease-in-out"
            style={{
              transitionDelay: open ? `${150 + i * 50}ms` : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "none" : `translateY(${from === "above" ? -6 : 6}px)`,
            }}
          >
            {node}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Text over art: About and Books pages                               */
/* ----------------------------------------------------------------- */

function AboutText() {
  return (
    <div className="flex flex-col gap-5">
      {about.paragraphs.map((p) => (
        <p key={p} className="text-xl leading-relaxed text-white/90">
          {p}
        </p>
      ))}
    </div>
  );
}

function BooksText() {
  return (
    <ul className="flex flex-col divide-y divide-white/15">
      {books.map((bk) => (
        <li key={bk.title} className="py-4 first:pt-0 last:pb-0">
          <div className="text-xl font-bold leading-tight">
            {bk.url ? (
              <a href={bk.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
                {bk.title}
              </a>
            ) : (
              bk.title
            )}
          </div>
          <div className="mt-1 text-sm text-white/55">{bk.author}</div>
          {bk.note && <p className="mt-2 text-sm leading-relaxed text-white/80">{bk.note}</p>}
        </li>
      ))}
    </ul>
  );
}

/** Dark, blurred strip over the artwork. "Hide" tucks it away to show the whole piece. */
function TextPanel({ page, faded, hidden, setHidden }: { page: TextPage; faded: boolean; hidden: boolean; setHidden: (h: boolean) => void }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 350);
    return () => clearTimeout(t);
  }, []);
  const visible = entered && !hidden && !faded;
  // Escape tucks the text away (menus close first when one is open).
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setHidden(true);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, setHidden]);
  const title = page === "about" ? "About" : "Books";
  return (
    <>
      {/* clicking anywhere outside the panel hides it */}
      {visible && <button type="button" aria-label={`Hide ${title}`} className="fixed inset-0 z-[34] cursor-default" onClick={() => setHidden(true)} />}
      <section
        aria-label={title}
        className="text-panel z-[35] flex flex-col bg-black/55 text-white backdrop-blur-xl transition-[opacity,transform] duration-700 ease-[cubic-bezier(.165,.84,.44,1)]"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-24px)", visibility: visible ? "visible" : "hidden" }}
      >
        <div className="flex h-14 flex-none items-center justify-between border-b border-white/15 px-6">
          <h2 className="font-bold">{title}</h2>
          <button type="button" className="text-sm font-semibold text-white/70 hover:text-white" onClick={() => setHidden(true)}>
            Hide
          </button>
        </div>
        <div className="scrollbar-hidden flex-1 overflow-y-auto px-6 py-6">{page === "about" ? <AboutText /> : <BooksText />}</div>
      </section>
      <button
        type="button"
        onClick={() => setHidden(false)}
        className="text-panel-show z-[35] h-8 border border-white/60 bg-black/40 px-2.5 text-sm font-bold text-white backdrop-blur transition-opacity duration-500"
        style={{ opacity: hidden && !faded ? 1 : 0, visibility: hidden && !faded ? "visible" : "hidden" }}
      >
        Show {title}
      </button>
    </>
  );
}

/* ----------------------------------------------------------------- */
/* The whole page                                                     */
/* ----------------------------------------------------------------- */

export function Experience({ page }: { page?: Page }) {
  const textPage: TextPage | undefined = page === "about" || page === "books" ? page : undefined;
  const [idx, setIdx] = useState(0);
  const isGallery = page === "art" && gallery.length > 0;
  const art: Art = isGallery
    ? gallery[idx]
    : textPage && pageArt[textPage].image
      ? { image: pageArt[textPage].image!, credit: pageArt[textPage].credit ?? null }
      : home;
  const [menu, setMenu] = useState<Menu>(null);
  const [textHidden, setTextHidden] = useState(false);
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
  const aboutItems = [
    <Link key="about" href="/about/" onClick={closeAll} className={`hover:opacity-50 ${page === "about" ? "underline underline-offset-4" : ""}`}>
      About
    </Link>,
    <Link key="books" href="/books/" onClick={closeAll} className={`hover:opacity-50 ${page === "books" ? "underline underline-offset-4" : ""}`}>
      Books
    </Link>,
    <Link key="art" href="/art/" onClick={closeAll} className={`hover:opacity-50 ${page === "art" ? "underline underline-offset-4" : ""}`}>
      Art
    </Link>,
    <button key="misc" type="button" className="text-left hover:opacity-50" onClick={() => openDrawer({ kind: "misc" })}>
      Misc
    </button>,
  ];
  const links = linkItems().map(([label, href]) => (
    <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="hover:opacity-50">
      {label}
    </a>
  ));

  const anyOpen = menu !== null || drawer !== null;

  // Gallery: flip with arrow keys and swipes; preload the neighbours.
  const step = useCallback((d: number) => setIdx((i) => (i + d + gallery.length) % gallery.length), []);
  const canFlip = isGallery && gallery.length > 1;
  useEffect(() => {
    if (!canFlip || anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    let x0: number | null = null;
    const onStart = (e: TouchEvent) => (x0 = e.touches[0].clientX);
    const onEnd = (e: TouchEvent) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      x0 = null;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [canFlip, anyOpen, step]);
  useEffect(() => {
    if (!canFlip) return;
    for (const d of [1, -1]) new Image().src = gallery[(idx + d + gallery.length) % gallery.length].image;
  }, [canFlip, idx]);
  const btn = "px-2.5 text-base font-semibold transition-opacity duration-300 hover:opacity-60";
  const shown = drawer ?? lastDrawer;

  return (
    <>
      <Loader />
      <Artwork key={art.image} dimmed={anyOpen} art={art} coverOnMobile={!!textPage && !textHidden} />
      {textPage && <TextPanel key={textPage} page={textPage} faded={anyOpen} hidden={textHidden} setHidden={setTextHidden} />}

      {/* Gallery: on desktop each half of the screen is a click zone with an arrow cursor.
          The header sits above it, so the cursor is normal over the menus. */}
      {canFlip && !anyOpen && (
        <div className="fixed inset-0 z-[38] hidden md:flex">
          <button type="button" tabIndex={-1} aria-label="Previous piece" className="cursor-prev h-full w-1/2 outline-none" onClick={() => step(-1)} />
          <button type="button" tabIndex={-1} aria-label="Next piece" className="cursor-next h-full w-1/2 outline-none" onClick={() => step(1)} />
        </div>
      )}

      {/* Gallery controls: corners on desktop, beside the credit on phones */}
      {canFlip && !anyOpen && (
        <>
          <button type="button" onClick={() => step(-1)} className="fixed bottom-6 left-6 z-40 hidden px-2.5 text-base font-semibold text-white transition-opacity hover:opacity-60 md:block">
            Previous
          </button>
          <button type="button" onClick={() => step(1)} className="fixed bottom-6 right-6 z-40 hidden px-2.5 text-base font-semibold text-white transition-opacity hover:opacity-60 md:block">
            Next
          </button>
          <button type="button" aria-label="Previous" onClick={() => step(-1)} className="fixed bottom-[70px] left-6 z-40 h-8 w-8 border border-neutral-300 bg-black/40 font-bold text-neutral-200 backdrop-blur md:hidden [@media(max-height:500px)]:hidden">
            ←
          </button>
          <button type="button" aria-label="Next" onClick={() => step(1)} className="fixed bottom-[70px] right-6 z-40 h-8 w-8 border border-neutral-300 bg-black/40 font-bold text-neutral-200 backdrop-blur md:hidden [@media(max-height:500px)]:hidden">
            →
          </button>
        </>
      )}

      {/* click-away layer */}
      {anyOpen && <button type="button" aria-label="Close" className="fixed inset-0 z-30 cursor-default" onClick={closeAll} />}

      {/* Credit tag for the artwork */}
      {art.credit && (
        <div className="pointer-events-auto fixed bottom-[76px] left-1/2 z-40 [@media(max-height:500px)]:bottom-8 w-max max-w-[calc(100vw-112px)] md:max-w-[calc(100vw-48px)] [@media(max-height:500px)]:max-w-[calc(100vw-240px)] -translate-x-1/2 text-balance text-center leading-snug text-xs text-white/80 transition-opacity duration-300 [text-shadow:0_0_8px_rgba(0,0,0,0.95)] md:bottom-7" style={{ opacity: anyOpen ? 0 : 1, visibility: anyOpen ? "hidden" : "visible" }}>
          {isGallery && gallery.length > 1 && (
            <span className="mr-1.5 tabular-nums text-white/55">
              {idx + 1} / {gallery.length} ·
            </span>
          )}
          {art.credit.url ? (
            <a href={art.credit.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <CreditText c={art.credit} />
            </a>
          ) : (
            <CreditText c={art.credit} />
          )}
        </div>
      )}

      {/* Header */}
      <header className="pointer-events-none fixed inset-0 z-40 text-white [text-shadow:0_0_12px_rgba(0,0,0,0.8)]">
        {/* desktop top bar */}
        <div className="pointer-events-auto absolute inset-x-6 top-0 hidden h-[72px] items-center justify-between md:flex">
          <nav className="flex items-center gap-7">
            <button type="button" className={btn} aria-expanded={menu === "projects"} onClick={() => toggle("projects")}>
              Projects
            </button>
            <button type="button" className={btn} aria-expanded={menu === "about"} onClick={() => toggle("about")}>
              About
            </button>
          </nav>
          <h1 className="absolute left-1/2 -translate-x-1/2 font-bold">
            <Link href="/">{site.name}</Link>
          </h1>
          <button type="button" className={btn} aria-expanded={menu === "contact"} onClick={() => toggle("contact")}>
            Contact
          </button>
        </div>

        {/* mobile */}
        <h1 className="pointer-events-auto fixed left-1/2 top-10 -translate-x-1/2 whitespace-nowrap font-bold md:hidden [@media(max-height:500px)]:top-3">
          <Link href="/">{site.name}</Link>
        </h1>
        <div className="pointer-events-auto fixed inset-x-6 bottom-6 flex items-center justify-between md:hidden">
          <button type="button" className="h-8 border border-neutral-300 bg-black/40 px-2 font-bold text-neutral-200 backdrop-blur" aria-expanded={menu === "mobile"} onClick={() => toggle("mobile")}>
            {menu === "mobile" ? "Close" : "Menu"}
          </button>
          <button type="button" className="h-8 border border-neutral-300 bg-black/40 px-2 font-bold text-neutral-200 backdrop-blur" aria-expanded={menu === "links"} onClick={() => toggle("links")}>
            {menu === "links" ? "Close" : "Contact"}
          </button>
        </div>
      </header>

      {/* Left panel: projects / about / mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!(menu === "projects" || menu === "about" || menu === "mobile")}
        className="fixed bottom-0 left-0 top-0 z-[36] w-[calc(100vw-120px)] max-w-[353px] text-white transition-all duration-500 ease-[cubic-bezier(.165,.84,.44,1)]"
        style={{
          visibility: menu === "projects" || menu === "about" || menu === "mobile" ? "visible" : "hidden",
          transform: menu === "projects" || menu === "about" || menu === "mobile" ? "none" : "translateX(-100%)",
        }}
      >
        <div className={`scrollbar-hidden absolute inset-0 overflow-y-auto px-6 pb-24 pt-28 ${menu === "projects" ? "" : "pointer-events-none invisible opacity-0"}`}>
          <MenuList open={menu === "projects"} items={projectItems} />
        </div>
        <div className={`scrollbar-hidden absolute inset-0 overflow-y-auto px-6 pb-24 pt-28 ${menu === "about" ? "" : "pointer-events-none invisible opacity-0"}`}>
          <MenuList open={menu === "about"} items={aboutItems} />
        </div>
        <div className={`scrollbar-hidden absolute inset-0 overflow-y-auto px-6 pb-24 pt-28 ${menu === "mobile" ? "" : "pointer-events-none invisible opacity-0"}`}>
          <h3 className="mb-3 font-bold opacity-60">Projects</h3>
          <MenuList open={menu === "mobile"} items={projectItems} />
          <h3 className="mb-3 mt-8 font-bold opacity-60">About</h3>
          <MenuList open={menu === "mobile"} items={aboutItems} />
          <h3 className="mb-3 mt-8 font-bold opacity-60">Contact</h3>
          <MenuList open={menu === "mobile"} items={links} />
        </div>
      </div>

      {/* Contact links: top-right dropdown on desktop, above the Contact button on phones */}
      <LinksList open={menu === "contact"} links={links} className="right-6 top-[60px] hidden md:block" from="above" />
      <LinksList open={menu === "links"} links={links} className="bottom-16 right-6 md:hidden" from="below" />

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
