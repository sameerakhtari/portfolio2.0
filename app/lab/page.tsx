import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { IndexLabel } from "@/components/experience/Chapter";
import { LabExplorer } from "@/components/experience/LabExplorer";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "The homelab",
  "Explore the physical, network, compute, storage and service layers of Sameer Akhtari's evolving home infrastructure.",
  "/lab",
);
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell lab-page">
        <IndexLabel index="LAB">PERSONAL INFRASTRUCTURE / EVOLVING</IndexLabel>
        <div className="page-heading">
          <h1>
            Everything
            <br /> is connected.
          </h1>
          <p>
            Look through the layers of the lab.
            <br /> A dedicated network, a Linux home server,
            <br /> and a separate Kubernetes experiment.
          </p>
        </div>
        <LabExplorer />
        <div className="lab-bottom">
          <p>
            Architecture is a relationship between decisions. This is a
            conceptual map of the lab, with the service ecosystem captured in
            the September 2026 portfolio brief.
          </p>
          <Link href="/projects/homelab" className="text-link">
            Read the full case study ↗
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
