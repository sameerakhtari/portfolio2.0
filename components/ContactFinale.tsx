import Link from "next/link";
import { profile } from "@/data/profile";

export function ContactFinale() {
  return (
    <div className="contact-finale">
      <div className="contact-heading">
        <span className="eyebrow">
          THERE IS ALWAYS ANOTHER SYSTEM TO BUILD.
        </span>
        <h2>
          Still
          <br /> <span>building.</span>
        </h2>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="contact-identity">
        <svg viewBox="0 0 360 370" fill="none" aria-hidden="true">
          <path
            d="M15 285H65L180 75H280L325 150H225L170 245H300"
            stroke="currentColor"
            strokeWidth="1"
            opacity=".25"
          />
          <path
            d="M15 300H75L185 100H264L290 145H219L160 260H312"
            stroke="#214ee5"
            strokeWidth="3"
          />
          <path
            d="M10 315H85L192 124H246L248 126H208L141 280H320"
            stroke="#267d78"
            strokeWidth="2"
          />
          <path d="M50 30V70L125 200H305" stroke="#ad6c14" strokeWidth="1.5" />
          <path d="M75 22V60L148 180H322" stroke="#923b4c" strokeWidth="1" />
          <circle cx="75" cy="300" r="5" fill="#214ee5" />
          <circle cx="185" cy="100" r="5" fill="#214ee5" />
          <circle cx="160" cy="260" r="5" fill="#214ee5" />
          <path
            d="M30 350H330M340 30V340"
            stroke="currentColor"
            strokeDasharray="2 5"
            opacity=".25"
          />
        </svg>
        <p>
          Ideas become connections.
          <br /> Connections become systems.
        </p>
        <div className="contact-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <Link href="/about">Read my profile ↗</Link>
        </div>
      </div>
    </div>
  );
}
