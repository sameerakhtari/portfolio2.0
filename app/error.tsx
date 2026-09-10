"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="page-shell">
      <span className="eyebrow">VIEW INTERRUPTED</span>
      <h1>Let’s reconnect.</h1>
      <p>This view could not finish loading.</p>
      <button className="primary-link" type="button" onClick={reset}>
        Try again ↻
      </button>
      <Link href="/" className="text-link">
        Return home ↗
      </Link>
    </main>
  );
}
