import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { IndexLabel } from "@/components/experience/Chapter";
import { labNotes } from "@/data/notes";
import { pageMetadata } from "@/lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return labNotes.map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const note = labNotes.find((n) => n.slug === slug);
  return note
    ? pageMetadata(note.title, note.summary, `/notes/${slug}`)
    : { title: "Note not found" };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const note = labNotes.find((n) => n.slug === slug);
  if (!note) notFound();
  return (
    <>
      <Header />
      <main id="main" className="page-shell note-detail">
        <Link href="/notes" className="back-link">
          ← Field notes
        </Link>
        <IndexLabel index={note.number}>
          {note.domain} / {note.date}
        </IndexLabel>
        <h1>{note.title}</h1>
        <p className="note-deck">{note.summary}</p>
        <div className="notebook-entries">
          {note.entries.map((entry) => (
            <section key={entry.label}>
              <h2>{entry.label}</h2>
              <p>{entry.text}</p>
            </section>
          ))}
        </div>
        {note.link && (
          <a
            href={note.link.href}
            className="text-link"
            target="_blank"
            rel="noreferrer"
          >
            {note.link.label} ↗
          </a>
        )}
        <Link href="/notes" className="text-link">
          Return to the notebook ↗
        </Link>
      </main>
      <Footer />
    </>
  );
}
