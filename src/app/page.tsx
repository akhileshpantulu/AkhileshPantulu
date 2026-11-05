import { projects, site } from "@/content/site";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { DotGrid } from "@/components/dot-grid";
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
        <Section id="projects" index="01" title="Projects" meta={`${pad2(projects.length)} PROJECTS`}>
          <ProjectList />
        </Section>
        <Section id="tech" index="02" title="Tech I work with" meta="STACK">
          <TechPhysics />
        </Section>
        <Section id="about" index="03" title="About" meta="WHO">
          <About />
        </Section>
        <Section id="contact" index="04" title="Get in touch" meta="LET'S TALK">
          <Contact />
        </Section>
        <Footer />
      </main>
    </>
  );
}
