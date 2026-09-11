"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "./Chapter";
import { useMotion } from "./MotionProvider";
import type { HardwareKind, HardwareControls } from "@/lib/hardware-scene";
import { MiniDiagram } from "./MiniDiagram";

export function HardwareScene({
  kind,
  exploded = false,
  progress: override,
}: {
  kind: HardwareKind;
  exploded?: boolean;
  progress?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{
    update: (c: HardwareControls) => void;
    dispose: () => void;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const { progress, active } = useScene();
  const { reduced } = useMotion();
  const latest = useRef<HardwareControls>({
    progress: 0,
    active: true,
    reduced: false,
    exploded: false,
  });
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let dead = false,
      started = false;
    const initialize = () => {
      if (started) return;
      started = true;
      import("@/lib/hardware-scene")
        .then((module) => {
          if (dead) return;
          try {
            api.current = module.createHardwareScene(element, kind);
            api.current.update(latest.current);
            setReady(true);
          } catch {
            setReady(false);
          }
        })
        .catch(() => setReady(false));
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          initialize();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    const lost = (event: Event) => {
      event.preventDefault();
      setReady(false);
      api.current?.dispose();
      api.current = null;
    };
    element.addEventListener("webglcontextlost", lost);
    return () => {
      dead = true;
      observer.disconnect();
      element.removeEventListener("webglcontextlost", lost);
      api.current?.dispose();
      api.current = null;
    };
  }, [kind]);
  useEffect(() => {
    latest.current = {
      progress: override ?? progress,
      active,
      reduced,
      exploded,
    };
    api.current?.update(latest.current);
  }, [progress, override, active, reduced, exploded]);
  return (
    <div
      className={`hardware-scene hardware-${kind}`}
      data-scene-focus
      role="img"
      aria-label={
        kind === "lab"
          ? "Dimensional diagram: a mini-PC router and switches connect a Linux home server and separate Kubernetes hardware on a side table."
          : kind === "cluster"
            ? "Three repurposed laptop motherboards connected as a Kubernetes cluster."
            : "Exploded compute board: processor, memory, cooling and network interfaces."
      }
    >
      {!ready && (
        <div className="hardware-fallback">
          <MiniDiagram kind={kind === "board" ? "code" : kind} />
        </div>
      )}
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={ready ? "is-ready" : ""}
      />
    </div>
  );
}
