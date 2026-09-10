import Link from "next/link";
import { Header, Footer, JourneyRail } from "@/components/SiteChrome";
import { Chapter, IndexLabel } from "@/components/experience/Chapter";
import { HardwareScene } from "@/components/experience/HardwareScene";
import { LiquidImage } from "@/components/experience/LiquidImage";
import { SystemDiagram } from "@/components/experience/SystemDiagram";
import {
  CareerEvolution,
  LabPreview,
  ClusterVisual,
  DomainMap,
} from "@/components/experience/InteractiveSections";
import { MiniDiagram } from "@/components/experience/MiniDiagram";
import { ContactFinale } from "@/components/ContactFinale";
import { profile, education, certifications } from "@/data/profile";
import { projects } from "@/data/projects";
import { labNotes } from "@/data/notes";
import { site } from "@/data/site";

function Bridge({ label }: { label: string }) {
  return (
    <div className="chapter-bridge" aria-hidden="true">
      <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path
          d="M180 0V30Q180 50 200 50H680Q700 50 700 70V100"
          fill="none"
          stroke="currentColor"
        />
        <path
          d="M188 0V25Q188 42 207 42H690Q708 42 708 66V100"
          fill="none"
          stroke="currentColor"
          opacity=".18"
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <JourneyRail />
      <main id="main" className="story">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              url: site.origin,
              jobTitle: profile.role,
              worksFor: { "@type": "Organization", name: profile.company },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: education.institution,
              },
              sameAs: [profile.github, profile.linkedin],
            }),
          }}
        />
        <Chapter id="init" className="hero">
          <div className="hero-topline">
            <IndexLabel index="00">SYSTEM INITIALIZING</IndexLabel>
            <span className="hero-edition">ENGINEERING JOURNAL / VOL. 02</span>
          </div>
          <div className="hero-composition">
            <div className="hero-copy">
              <p className="hero-name">
                {profile.name}
                <span>
                  {profile.role} · {profile.company}
                </span>
              </p>
              <h1>
                I think
                <br /> in <em>systems.</em>
              </h1>
              <p className="hero-description">
                From a line of code to a network of machines.
                <br /> I build what connects them.
              </p>
              <Link href="/projects" className="primary-link">
                Explore my work <span>↗</span>
              </Link>
            </div>
            <div className="hero-visual">
              <div className="hero-inlet">
                <i />
                <span>01 / THE FIRST CONNECTION</span>
              </div>
              <HardwareScene kind="board" />
              <div className="hero-visual-label">
                <span>COMPUTE / EXPLODED STUDY</span>
                <p>Software meets the physical world.</p>
              </div>
              <span className="crosshair corner-top" />
              <span className="crosshair corner-bottom" />
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#foundation" className="scroll-cue">
              <span>↓</span> Follow the signal
            </a>
            <p>
              LINUX / CLOUD / NETWORKING
              <br /> KUBERNETES / AUTOMATION / HOMELAB
            </p>
            <span className="hero-location">
              BASED IN PAKISTAN
              <br /> BUILDING ACROSS LAYERS
            </span>
          </div>
        </Chapter>
        <Bridge label="A FOUNDATION IN SOFTWARE" />
        <Chapter id="foundation" className="foundation" color="#a45e3e" sticky>
          <div className="chapter-inner">
            <IndexLabel index="01">FOUNDATION / JAMSHORO, SINDH</IndexLabel>
            <div className="foundation-heading">
              <h2>
                Every system
                <br /> starts somewhere.
              </h2>
              <div>
                <span className="large-date">
                  2018<span>— 2023</span>
                </span>
                <p>{education.shortDegree}</p>
              </div>
            </div>
            <div className="campus-scene">
              <LiquidImage
                src="/images/muet.webp"
                alt="Original watercolor and graphite interpretation of the MUET Administration Building in Jamshoro, with its warm facade and patterned towers."
              />
              <div className="campus-notation" aria-hidden="true">
                f(input) → output
                <br /> O(n log n)
                <br /> idea → algorithm → system
              </div>
            </div>
            <div className="education-details">
              <div>
                <h3>{education.institution}</h3>
                <p>
                  {education.period} <span>CGPA {education.cgpa}</span>
                </p>
              </div>
              <Link href="/about" className="text-link">
                The foundation ↗
              </Link>
            </div>
            <p className="asset-credit">
              Administration Building · Illustration adapted from{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:MUET_Admin_Building.jpg"
                target="_blank"
                rel="noreferrer"
              >
                Kskhh’s photograph
              </a>{" "}
              ·{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY-SA 4.0
              </a>{" "}
              · Watercolor interpretation.
            </p>
          </div>
        </Chapter>
        <Bridge label="FROM SOFTWARE TO THE SYSTEM UNDERNEATH" />
        <Chapter id="practice" className="practice">
          <div className="chapter-inner">
            <IndexLabel index="02">PROFESSIONAL PRACTICE</IndexLabel>
            <div className="split-heading">
              <h2>
                Follow the packet.
                <br /> Find the cause.
              </h2>
              <div>
                <span className="role-label">
                  {profile.role.toUpperCase()} / {profile.company.toUpperCase()}
                </span>
                <p>
                  Linux, cloud infrastructure and the web stack. I investigate
                  how the pieces behave together, from a DNS answer to a
                  database query.
                </p>
              </div>
            </div>
            <SystemDiagram />
            <CareerEvolution />
          </div>
        </Chapter>
        <Bridge label="THE SAME CURIOSITY. A DIFFERENT ENVIRONMENT." />
        <Chapter id="homelab" className="homelab" color="#356e8e" sticky>
          <div className="chapter-inner">
            <IndexLabel index="03">
              PERSONAL INFRASTRUCTURE / EVOLVING
            </IndexLabel>
            <div className="split-heading">
              <h2>
                A lab
                <br /> of my own.
              </h2>
              <div>
                <p>
                  A dedicated router. A Linux server. Cameras, containers, media
                  and home automation. Built, connected and continuously
                  reworked.
                </p>
                <Link href="/lab" className="primary-link">
                  Enter the homelab <span>↗</span>
                </Link>
              </div>
            </div>
            <LabPreview />
            <div className="lab-service-ribbon">
              <span>pfSense</span>
              <span>Docker Compose</span>
              <span>Jellyfin</span>
              <span>Frigate</span>
              <span>Home Assistant</span>
              <span>Immich</span>
              <span>Authelia</span>
            </div>
          </div>
        </Chapter>
        <Bridge label="REUSE THE HARDWARE. RETHINK THE POSSIBILITIES." />
        <Chapter id="cluster" className="cluster" color="#2455d7" sticky>
          <div className="chapter-inner">
            <IndexLabel index="04">
              RECLAIMED COMPUTE / KUBERNETES LAB
            </IndexLabel>
            <div className="split-heading">
              <h2>
                Three boards.
                <br /> One cluster.
              </h2>
              <div>
                <p>
                  Repurposed laptop motherboards. Different CPU generations.
                  Approximately 48 GB of RAM. Real hardware, running one
                  connected experiment.
                </p>
                <Link href="/projects/reclaimed-cluster" className="text-link">
                  Inspect the cluster ↗
                </Link>
              </div>
            </div>
            <ClusterVisual />
            <p className="figure-note">
              July–August 2026 snapshot · Kubernetes v1.34.9 / containerd 2.2.2
              / kube-burner v2.8.1. Counts describe the recorded experiment.
            </p>
          </div>
        </Chapter>
        <Bridge label="WHEN CONNECTIONS BECOME A WORKFLOW" />
        <Chapter id="automation" className="automation" color="#ad6c14">
          <div className="chapter-inner">
            <IndexLabel index="05">
              AUTOMATION / CONSTRAINT → ITERATION
            </IndexLabel>
            <div className="split-heading">
              <h2>
                There is
                <br /> another route.
              </h2>
              <div>
                <p>
                  The Sheets integration was unavailable. The reporting workflow
                  took a different path: structured records, CSV generation,
                  email delivery.
                </p>
                <Link
                  href="/projects/operational-automation"
                  className="text-link"
                >
                  Explore the workflow ↗
                </Link>
              </div>
            </div>
            <SystemDiagram variant="workflow" />
          </div>
        </Chapter>
        <Bridge label="EARLIER EXPERIMENTS. THE SAME THREAD." />
        <Chapter id="archive" className="archive" color="#267d78">
          <div className="chapter-inner">
            <IndexLabel index="06">PROJECT ARCHIVE</IndexLabel>
            <div className="split-heading">
              <h2>
                The curiosity
                <br /> came first.
              </h2>
              <div>
                <p>
                  Embedded vision, encrypted communication, circuits and the
                  first home network. Earlier experiments explain the systems I
                  build today.
                </p>
                <Link href="/projects" className="text-link">
                  All {projects.length} systems ↗
                </Link>
              </div>
            </div>
            <div className="archive-grid">
              {projects
                .filter((p) =>
                  [
                    "smart-hat",
                    "encrypted-chat",
                    "home-network",
                    "smart-home",
                  ].includes(p.slug),
                )
                .map((project) => (
                  <Link
                    href={`/projects/${project.slug}`}
                    key={project.slug}
                    className="archive-item"
                    style={
                      {
                        "--project-color": project.color,
                      } as React.CSSProperties
                    }
                  >
                    <div className="archive-meta">
                      <span>EXPERIMENT {project.index}</span>
                      <span>{project.year}</span>
                    </div>
                    <MiniDiagram kind={project.diagram} color={project.color} />
                    <div className="archive-title">
                      <h3>{project.subtitle}</h3>
                      <span>↗</span>
                    </div>
                    <p>{project.summary}</p>
                    <span className="archive-status">
                      {project.status} / {project.domain}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </Chapter>
        <Bridge label="NOT A LIST OF TOOLS. A MAP OF RELATIONSHIPS." />
        <Chapter id="connections" className="connections">
          <div className="chapter-inner">
            <IndexLabel index="07">CONNECTED PRACTICE</IndexLabel>
            <div className="split-heading">
              <h2>
                Nothing works
                <br /> in isolation.
              </h2>
              <div>
                <p>{profile.bio}</p>
              </div>
            </div>
            <DomainMap />
            <div className="learning-path">
              <div>
                <span className="eyebrow">LEARNING → PRACTICE</span>
                <h3>
                  Another connection
                  <br /> with every course.
                </h3>
              </div>
              <div>
                {certifications.map((cert) => (
                  <div className="learning-row" key={cert.title}>
                    <span>{cert.domain}</span>
                    <h4>{cert.title}</h4>
                    <p>
                      {cert.issuer} · {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Chapter>
        <Bridge label="KEEP A RECORD OF WHAT CHANGES" />
        <Chapter id="field-notes" className="field-notes" color="#ad6c14">
          <div className="chapter-inner">
            <IndexLabel index="08">FIELD NOTES</IndexLabel>
            <div className="split-heading">
              <h2>
                Things I’m
                <br /> figuring out.
              </h2>
              <div>
                <p>
                  The constraints, observations and unfinished edges of working
                  with real systems.
                </p>
                <Link href="/notes" className="text-link">
                  Open the notebook ↗
                </Link>
              </div>
            </div>
            <div className="notes-list">
              {labNotes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="note-row"
                >
                  <span className="note-index">{note.number}</span>
                  <div>
                    <span className="eyebrow">
                      {note.domain} / {note.date}
                    </span>
                    <h3>{note.title}</h3>
                    <p>{note.summary}</p>
                  </div>
                  <span className="note-arrow">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </Chapter>
        <Bridge label="THE SYSTEM IS NEVER FINISHED" />
        <Chapter id="contact" className="contact">
          <div className="chapter-inner">
            <IndexLabel index="09">NEXT CONNECTION</IndexLabel>
            <ContactFinale />
          </div>
        </Chapter>
      </main>
      <Footer />
    </>
  );
}
