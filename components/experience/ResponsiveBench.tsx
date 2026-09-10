"use client";
import { useState } from "react";
import { chapters } from "@/data/site";
import { projects } from "@/data/projects";

/** Development-only, real CSS viewports; no runtime emulation or production UI. */
export function ResponsiveBench() {
  const [width, setWidth] = useState(390);
  const [path, setPath] = useState("/");
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
            {[320, 390, 768, 1024, 1280].map((w) => (
              <option key={w} value={w}>
                {w}px
              </option>
            ))}
          </select>
        </label>
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
