"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { chapters } from "@/data/site";
import { profile } from "@/data/profile";
import { subscribeScroll } from "@/lib/scroll-observer";

const links = [
  { href: "/", label: "Journey" },
  { href: "/projects", label: "Projects" },
  { href: "/lab", label: "The lab" },
  { href: "/notes", label: "Field notes" },
];
export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (
        menu.current?.open &&
        event.target instanceof Node &&
        !menu.current.contains(event.target)
      ) {
        menu.current.open = false;
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Sameer Akhtari, home">
          sa<span>/</span>
          <i className="wordmark-dot" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="header-contact">
          Let’s connect <span aria-hidden="true">↗</span>
        </Link>
        <details
          ref={menu}
          className="mobile-menu"
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current?.open) {
              event.preventDefault();
              menu.current.open = false;
              menu.current.querySelector("summary")?.focus();
            }
          }}
          onBlur={(event) => {
            if (
              event.relatedTarget instanceof Node &&
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              event.currentTarget.open = false;
            }
          }}
        >
          <summary>
            Menu <span>+</span>
          </summary>
          <nav aria-label="Mobile navigation">
            {[
              ...links,
              { href: "/about", label: "Profile" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
      </header>
    </>
  );
}

export function JourneyRail() {
  const [current, setCurrent] = useState("init");
  useEffect(() => {
    const update = () => {
      const chosen = chapters
        .filter((ch) => {
          const el = document.getElementById(ch.id);
          return el && el.getBoundingClientRect().top < innerHeight * 0.5;
        })
        .at(-1);
      setCurrent(chosen?.id ?? "init");
    };
    const unsubscribe = subscribeScroll(update);
    update();
    return unsubscribe;
  }, []);
  return (
    <nav className="journey-rail" aria-label="Journey chapters">
      <span className="rail-title">SCROLL TO CONNECT</span>
      {chapters.map((ch) => (
        <a
          key={ch.id}
          href={`#${ch.id}`}
          aria-label={`${ch.index} ${ch.name}`}
          aria-current={current === ch.id ? "step" : undefined}
        >
          <span className="rail-dot" />
          <span className="rail-name">
            {ch.index} / {ch.name}
          </span>
        </a>
      ))}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/" className="footer-name">
        {profile.name}
        <span>Software & systems engineer</span>
      </Link>
      <div>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <Link href="/about">Profile ↗</Link>
      </div>
      <span className="footer-note">Always an iteration ahead.</span>
    </footer>
  );
}
