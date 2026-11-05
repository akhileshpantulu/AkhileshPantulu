import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, site, type ArticleBlock } from "@/content/site";
import { longDate } from "@/components/format";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

function Block({ b }: { b: ArticleBlock }) {
  switch (b.type) {
    case "p":
      return <p>{b.text}</p>;
    case "h2":
      return <h2>{b.text}</h2>;
    case "list":
      return (
        <ul>
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre>
          <code>{b.text}</code>
        </pre>
      );
    case "quote":
      return <blockquote>{b.text}</blockquote>;
  }
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-black bg-white px-6">
        <Link href="/rooms/studio/" className="font-semibold hover:opacity-50">
          ← Studio
        </Link>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-bold">
          {site.name}
        </Link>
        <span />
      </header>
      <article className="mx-auto w-full max-w-2xl px-6 pb-24 pt-14 sm:pt-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {longDate(p.date)} · {p.topics}
        </div>
        <h1 className="mt-4 text-[clamp(36px,6vw,60px)] font-bold leading-[1.02] tracking-tight">{p.title}</h1>
        <p className="mt-6 text-xl leading-relaxed text-neutral-700">{p.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {p.stack.map((s) => (
            <span key={s} className="border border-black px-2 py-0.5 text-xs font-semibold">
              {s}
            </span>
          ))}
          {p.link && (
            <a href={p.link.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-semibold underline underline-offset-4 hover:opacity-50">
              {p.link.label} ↗
            </a>
          )}
        </div>
        <hr className="my-12 border-black" />
        <div className="prose-article">
          {p.body.map((b, i) => (
            <Block key={i} b={b} />
          ))}
        </div>
      </article>
    </div>
  );
}
