import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 font-mono text-[10.5px] tracking-[0.14em] text-fg-dim sm:px-8">
        <span>
          © {site.name.toUpperCase()} — {new Date().getFullYear()}
        </span>
        <span>BUILD · {site.version}</span>
      </div>
    </footer>
  );
}
