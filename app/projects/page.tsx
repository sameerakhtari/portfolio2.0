import { Header, Footer } from "@/components/SiteChrome";
import { IndexLabel } from "@/components/experience/Chapter";
import { ProjectIndex } from "@/components/experience/InteractiveSections";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Systems & experiments",
  "Explore Sameer Akhtari's homelab, Kubernetes cluster, automation and earlier software and hardware experiments.",
  "/projects",
);
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell projects-page">
        <IndexLabel index="INDEX">BUILT / EVOLVING / EXPERIMENTAL</IndexLabel>
        <div className="page-heading">
          <h1>
            Systems.
            <br /> Not just projects.
          </h1>
          <p>
            Each one connects a few more pieces.
            <br /> A record of what I’ve built, what evolved
            <br /> and what I’m still figuring out.
          </p>
        </div>
        <ProjectIndex />
      </main>
      <Footer />
    </>
  );
}
