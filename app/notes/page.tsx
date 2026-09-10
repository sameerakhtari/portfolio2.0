import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { IndexLabel } from "@/components/experience/Chapter";
import { labNotes } from "@/data/notes";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Field notes",
  "Constraints, observations and next iterations from Sameer Akhtari's engineering experiments.",
  "/notes",
);
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="page-shell">
        <IndexLabel index="LOG">OBSERVATIONS / ITERATIONS</IndexLabel>
        <div className="page-heading">
          <h1>
            Working notes.
            <br /> Open questions.
          </h1>
          <p>
            A record of the parts that take a little
            <br /> more investigation.
          </p>
        </div>
        <div className="notes-list">
          {labNotes.map((note) => (
            <Link
              href={`/notes/${note.slug}`}
              key={note.slug}
              className="note-row"
            >
              <span className="note-index">{note.number}</span>
              <div>
                <span className="eyebrow">
                  {note.domain} / {note.date}
                </span>
                <h2>{note.title}</h2>
                <p>{note.summary}</p>
              </div>
              <span className="note-arrow">↗</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
