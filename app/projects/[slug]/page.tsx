import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { IndexLabel } from "@/components/experience/Chapter";
import { HardwareScene } from "@/components/experience/HardwareScene";
import { SystemDiagram } from "@/components/experience/SystemDiagram";
import { MiniDiagram } from "@/components/experience/MiniDiagram";
import { LabExplorer } from "@/components/experience/LabExplorer";
import { projects, projectBySlug } from "@/data/projects";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  return p
    ? pageMetadata(p.subtitle, p.summary, `/projects/${p.slug}`)
    : { title: "Project not found" };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <Header />
      <main
        id="main"
        className={`page-shell case-study case-${project.diagram}`}
        style={{ "--chapter-color": project.color } as React.CSSProperties}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: project.subtitle,
              description: project.summary,
              url: `${site.origin}/projects/${project.slug}`,
              creator: { "@type": "Person", name: profile.name },
              keywords: project.technologies.join(", "),
            }),
          }}
        />
        <Link href="/projects" className="back-link">
          ← Project index
        </Link>
        <IndexLabel index={project.index}>
          {project.domain} / {project.status}
        </IndexLabel>
        <div className="case-heading">
          <span className="eyebrow">
            {project.subtitle} / {project.year}
          </span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
        <div className="case-facts">
          {project.facts.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
        <div className="case-visual">
          {project.diagram === "lab" ? (
            <LabExplorer />
          ) : project.diagram === "cluster" ? (
            <HardwareScene kind="cluster" progress={1} />
          ) : project.diagram === "workflow" ? (
            <SystemDiagram variant="workflow" standalone />
          ) : (
            <MiniDiagram kind={project.diagram} color={project.color} />
          )}
        </div>
        <div className="case-body">
          <aside>
            <span className="eyebrow">IN THIS SYSTEM</span>
            <nav aria-label="Case study sections">
              {project.sections.map((section, i) => (
                <a href={`#section-${i}`} key={section.heading}>
                  {section.heading}
                </a>
              ))}
            </nav>
            <div className="case-tech">
              <span className="eyebrow">TECHNOLOGY</span>
              {project.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {project.links?.map((link) => (
              <a
                key={link.href}
                className="text-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} ↗
              </a>
            ))}
          </aside>
          <article>
            {project.sections.map((section, i) => (
              <section id={`section-${i}`} key={section.heading}>
                <span className="section-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </article>
        </div>
        <Link className="next-project" href={`/projects/${next.slug}`}>
          <span className="eyebrow">NEXT SYSTEM</span>
          <h2>{next.title}</h2>
          <span>↗</span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
