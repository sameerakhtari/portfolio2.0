import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell not-found">
        <span className="eyebrow">404 / CONNECTION NOT FOUND</span>
        <h1>
          This route
          <br /> isn’t connected.
        </h1>
        <p>The page may have moved, or the address may be incomplete.</p>
        <Link href="/" className="primary-link">
          Back to the system <span>↗</span>
        </Link>
        <Link href="/projects" className="text-link">
          Explore projects ↗
        </Link>
      </main>
      <Footer />
    </>
  );
}
