import { Header, Footer } from "@/components/SiteChrome";
import { IndexLabel } from "@/components/experience/Chapter";
import { ContactFinale } from "@/components/ContactFinale";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "The next connection",
  "Contact Sameer Akhtari about software, infrastructure and connected systems.",
  "/contact",
);
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell contact-page">
        <IndexLabel index="CONTACT">NEXT CONNECTION</IndexLabel>
        <h1 className="sr-only">Contact Sameer Akhtari</h1>
        <ContactFinale />
      </main>
      <Footer />
    </>
  );
}
