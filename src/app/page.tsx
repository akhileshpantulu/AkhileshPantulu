import { flagships, projects, site } from "@/content/site";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { DotGrid } from "@/components/dot-grid";
import { FlagshipCard } from "@/components/flagship-card";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { ProjectList } from "@/components/project-list";
import { Section, pad2 } from "@/components/section";
import { TechPhysics } from "@/components/tech-physics";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    sameAs: [site.links.github, site.links.linkedin],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DotGrid />
      <main id="top" className="relative z-10">
        <Nav />
        <Hero />
        <Section id="work" index="01" title="Selected work" meta={`${pad2(flagships.length)} LIVE PRODUCTS`}>
          <div className="flex flex-col gap-4">
            {flagships.map((f) => (
              <FlagshipCard key={f.title} item={f} />
            ))}
          </div>
        </Section>
        <Section id="projects" index="02" title="Projects" meta={`${pad2(projects.length)} PROJECTS`}>
          <ProjectList />
        </Section>
        <Section id="tech" index="03" title="Tech I work with" meta="STACK">
          <TechPhysics />
        </Section>
        <Section id="about" index="04" title="About" meta="WHO">
          <About />
        </Section>
        <Section id="contact" index="05" title="Get in touch" meta="LET'S TALK">
          <Contact />
        </Section>
        <Footer />
      </main>
    </>
  );
}
