import { Header, Footer } from "@/components/SiteChrome";
import { IndexLabel } from "@/components/experience/Chapter";
import {
  DomainMap,
  CareerEvolution,
} from "@/components/experience/InteractiveSections";
import { ProfileActions } from "@/components/ProfileActions";
import { profile, education, experience, certifications } from "@/data/profile";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "System profile",
  `${profile.name}, ${profile.role} at ${profile.company}. Career, education, projects and engineering practice.`,
  "/about",
);
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell profile-page">
        <IndexLabel index="PROFILE">
          {profile.identity.toUpperCase()}
        </IndexLabel>
        <div className="profile-heading">
          <h1>{profile.name}</h1>
          <p>
            {profile.role} · {profile.company}
          </p>
          <span>{profile.location}</span>
          <ProfileActions />
        </div>
        <p className="profile-bio">{profile.bio}</p>
        <div className="profile-contact">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.github}>GitHub ↗</a>
          <a href={profile.linkedin}>LinkedIn ↗</a>
        </div>
        <div className="profile-career">
          <h2>From the browser to the platform.</h2>
          <CareerEvolution />
        </div>
        <div className="profile-print-career">
          {experience.map((item) => (
            <section key={item.year}>
              <h3>
                {item.role} — {item.company}
              </h3>
              <span>{item.period}</span>
              <p>{item.scope}</p>
            </section>
          ))}
        </div>
        <section className="profile-education">
          <span className="eyebrow">FOUNDATION</span>
          <h2>{education.degree}</h2>
          <h3>{education.institution}</h3>
          <p>
            {education.period} · CGPA {education.cgpa}
          </p>
          <p>{education.description}</p>
        </section>
        <section className="profile-projects">
          <span className="eyebrow">SELECTED SYSTEMS</span>
          {projects.slice(0, 3).map((project) => (
            <div key={project.slug}>
              <h3>{project.subtitle}</h3>
              <p>{project.summary}</p>
            </div>
          ))}
        </section>
        <section className="profile-learning">
          <h2>Learning connections.</h2>
          {certifications.map((cert) => (
            <div className="learning-row" key={cert.title}>
              <span>{cert.domain}</span>
              <h3>{cert.title}</h3>
              <p>
                {cert.issuer} · {cert.date}
              </p>
            </div>
          ))}
        </section>
        <div className="profile-domains">
          <h2>A connected practice.</h2>
          <DomainMap />
        </div>
        {profile.resumePdf && (
          <a href={profile.resumePdf} download className="primary-link">
            Download current résumé
          </a>
        )}
      </main>
      <Footer />
    </>
  );
}
