import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, type ArticleBlock } from "@/content/site";
import { DotGrid } from "@/components/dot-grid";
import { Footer } from "@/components/footer";
import { longDate } from "@/components/format";
import { Nav } from "@/components/nav";
import { PreviewChart } from "@/components/previews";
import { StackChips } from "@/components/section";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
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
    <>
      <DotGrid />
      <main className="relative z-10">
        <Nav home />
        <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
          <Link
            href="/#projects"
            className="mb-10 inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-fg-muted transition-colors hover:text-accent-bright"
          >
            <ArrowLeft size={13} strokeWidth={2} /> all projects
          </Link>
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.18em]">
            <span className="text-fg-dim">Published · {longDate(p.date)}</span>
            <span className="text-accent">{p.topics}</span>
          </div>
          <h1 className="text-[clamp(34px,5.5vw,56px)] font-medium leading-[1.05] tracking-[-0.025em] text-fg-bright">{p.title}</h1>
          <p className="mt-6 text-[19px] leading-[1.55] text-fg-muted">{p.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <StackChips items={p.stack} variant="plain" />
            {p.link && (
              <a
                href={p.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.04em] text-accent hover:text-accent-bright"
              >
                {p.link.label}
                <ArrowUpRight size={14} strokeWidth={1.75} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
          <div className="liquid-glass mt-10 rounded-2xl p-5 sm:p-7">
            <div className="flex h-[180px] items-center sm:h-[220px]">
              <PreviewChart preview={p.preview} />
            </div>
          </div>
          <div className="prose-article mt-12">
            {p.body.map((b, i) => (
              <Block key={i} b={b} />
            ))}
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}
