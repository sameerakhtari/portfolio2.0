"use client";
import { useRef, useState } from "react";
import { chapters } from "@/data/site";
import { projects } from "@/data/projects";

/** Development-only, real CSS viewports; no runtime emulation or production UI. */
export function ResponsiveBench() {
  const [width, setWidth] = useState(390);
  const [path, setPath] = useState("/");
  const [scene, setScene] = useState("foundation");
  const frame = useRef<HTMLIFrameElement>(null);
  const sample = (fraction: number) => {
    const viewport = frame.current?.contentWindow;
    const chapter = viewport?.document.getElementById(scene);
    if (!viewport || !chapter) return;
    const style = viewport.getComputedStyle(chapter);
    const top = chapter.getBoundingClientRect().top + viewport.scrollY;
    const target =
      top -
      parseFloat(style.getPropertyValue("--pin-top")) +
      parseFloat(style.getPropertyValue("--scroll-budget")) * fraction;
    viewport.scrollTo({
      top: fraction <= 0 ? Math.floor(target) : Math.ceil(target),
      behavior: "instant",
    });
  };
  return (
    <main style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <strong>Responsive review</strong>
        <label>
          Viewport{" "}
          <select
            aria-label="Review viewport"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          >
            {[320, 375, 390, 768, 1024, 1440].map((w) => (
              <option key={w} value={w}>
                {w}px
              </option>
            ))}
          </select>
        </label>
        <label>
          Scene{" "}
          <select
            aria-label="Review scene"
            value={scene}
            onChange={(event) => {
              setScene(event.target.value);
              setPath(`/#${event.target.value}`);
            }}
          >
            {[
              "init",
              "foundation",
              "practice",
              "homelab",
              "cluster",
              "automation",
            ].map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <div
          role="group"
          aria-label="Scene samples"
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          {[-0.1, 0, 0.25, 0.5, 0.75, 1, 1.1].map((fraction) => (
            <button
              key={fraction}
              type="button"
              onClick={() => sample(fraction)}
            >
              {fraction < 0
                ? "Approach"
                : fraction > 1
                  ? "Released"
                  : `${fraction * 100}%`}
            </button>
          ))}
        </div>
        <label>
          Page{" "}
          <select
            aria-label="Review page"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          >
            <option value="/">Home</option>
            {chapters.map((c) => (
              <option key={c.id} value={`/#${c.id}`}>
                {c.name}
              </option>
            ))}
            {[
              "/projects",
              "/lab",
              "/notes",
              "/about",
              "/contact",
              "/dev/pigment",
            ].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            {projects.map((p) => (
              <option key={p.slug} value={`/projects/${p.slug}`}>
                {p.subtitle}
              </option>
            ))}
          </select>
        </label>
      </div>
      <iframe
        ref={frame}
        title="Responsive portfolio"
        src={path}
        style={{
          display: "block",
          boxSizing: "content-box",
          width,
          height: 800,
          border: "1px solid #aaa",
          margin: "0 auto",
          background: "#f2efe6",
        }}
      />
    </main>
  );
}
