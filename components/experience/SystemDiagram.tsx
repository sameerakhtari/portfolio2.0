"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useScene } from "./Chapter";
import { useMotion } from "./MotionProvider";
import { clamp } from "@/lib/pigment";
import {
  productionNodes,
  productionEdges,
  workflowNodes,
  workflowEdges,
} from "@/data/diagrams";
import { edgePath } from "@/lib/diagram-path";

export function FlowTrace({
  d,
  progress,
  color = "var(--chapter-color, #214ee5)",
  muted = false,
}: {
  d: string;
  progress: number;
  color?: string;
  muted?: boolean;
}) {
  const path = useRef<SVGPathElement>(null),
    drop = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (!path.current || !drop.current) return;
    const point = path.current.getPointAtLength(
      path.current.getTotalLength() * clamp(progress),
    );
    drop.current.setAttribute("cx", String(point.x));
    drop.current.setAttribute("cy", String(point.y));
  }, [progress, d]);
  return (
    <g opacity={muted ? 0.15 : 1}>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".24"
      />
      <path
        ref={path}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={100 - clamp(progress) * 100}
      />
      <circle
        ref={drop}
        r={progress > 0 && progress < 1 ? 3.3 : 0}
        fill={color}
      />
    </g>
  );
}

export function SystemDiagram({
  variant = "production",
  standalone = false,
}: {
  variant?: "production" | "workflow";
  standalone?: boolean;
}) {
  const nodes = variant === "production" ? productionNodes : workflowNodes,
    edges = variant === "production" ? productionEdges : workflowEdges;
  const [selected, setSelected] = useState(nodes[0].id),
    [replay, setReplay] = useState<number | null>(null);
  const { progress } = useScene();
  const { reduced } = useMotion();
  const id = useId().replaceAll(":", "");
  const playing = replay !== null;
  const p = reduced ? 1 : (replay ?? (standalone ? 1 : progress));
  const current = nodes.find((node) => node.id === selected)!;
  useEffect(() => {
    if (!playing || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const value = clamp((now - start) / 6500);
      setReplay(value);
      if (value < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced]);
  return (
    <div className={`system-diagram diagram-${variant}`}>
      <div className="diagram-toolbar">
        <span>
          {variant === "production"
            ? "REQUEST PATH / CONCEPTUAL"
            : "REPORTING WORKFLOW / DOCUMENTED DESIGN"}
        </span>
        <button
          type="button"
          className="text-button"
          onClick={() =>
            setReplay((previous) => (previous === null ? 0 : null))
          }
        >
          {replay === null ? "Trace the flow ↻" : "Follow scroll ↗"}
        </button>
      </div>
      <svg
        viewBox="0 0 945 465"
        className="system-svg"
        aria-label={
          variant === "production"
            ? "Interactive web request path"
            : "Interactive operational reporting workflow"
        }
        role="group"
      >
        <defs>
          <filter id={`wet-${id}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".07"
              numOctaves="2"
              seed="9"
            />
            <feDisplacementMap in="SourceGraphic" scale="12" />
          </filter>
        </defs>
        {edges.map((edge, i) => {
          const from = nodes.find((n) => n.id === edge.from)!,
            to = nodes.find((n) => n.id === edge.to)!;
          const d = edgePath(from, to);
          const related = edge.from === selected || edge.to === selected;
          return (
            <g key={i}>
              {edge.disabled ? (
                <path
                  d={d}
                  stroke="currentColor"
                  opacity=".24"
                  strokeDasharray="4 6"
                  fill="none"
                />
              ) : (
                <FlowTrace
                  d={d}
                  progress={clamp(
                    (p - from.arrival) / (to.arrival - from.arrival + 0.06),
                  )}
                  muted={selected !== nodes[0].id && !related}
                />
              )}
            </g>
          );
        })}
        {nodes.map((node) => {
          const fill = clamp((p - node.arrival) / 0.2);
          return (
            <g
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${node.label}`}
              aria-pressed={selected === node.id}
              onClick={() => setSelected(node.id)}
              onFocus={() => setSelected(node.id)}
              onMouseEnter={() => setSelected(node.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(node.id);
                }
              }}
              className={`system-node ${selected === node.id ? "selected" : ""}`}
            >
              <mask id={`fill-${id}-${node.id}`}>
                <rect
                  x={node.x - 70}
                  y={node.y - 34}
                  width="140"
                  height="68"
                  fill="black"
                />
                <g filter={`url(#wet-${id})`} fill="white">
                  <ellipse
                    cx={node.x - 50}
                    cy={node.y + 15}
                    rx={fill * 170}
                    ry={fill * 80}
                  />
                  <ellipse
                    cx={node.x + 15}
                    cy={node.y - 8}
                    rx={Math.max(0, fill - 0.25) * 190}
                    ry={Math.max(0, fill - 0.25) * 100}
                  />
                </g>
              </mask>
              <rect
                x={node.x - 70}
                y={node.y - 34}
                width="140"
                height="68"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth={selected === node.id ? 1.5 : 0.8}
              />
              <rect
                x={node.x - 70}
                y={node.y - 34}
                width="140"
                height="68"
                fill="var(--chapter-color, #214ee5)"
                opacity=".12"
                mask={`url(#fill-${id}-${node.id})`}
              />
              <text
                x={node.x}
                y={node.y - 2}
                textAnchor="middle"
                className="node-label"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 17}
                textAnchor="middle"
                className="node-subtitle"
              >
                {node.subtitle}
              </text>
              <circle
                cx={node.x - 70}
                cy={node.y}
                r="2.5"
                fill={
                  fill > 0.1 ? "var(--chapter-color, #214ee5)" : "var(--paper)"
                }
                stroke="currentColor"
              />
            </g>
          );
        })}
      </svg>
      <div
        className="diagram-mobile-controls"
        aria-label="Inspect diagram nodes"
      >
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            onClick={() => setSelected(node.id)}
            aria-pressed={selected === node.id}
          >
            {node.label}
          </button>
        ))}
      </div>
      <div className="diagram-explanation" aria-live="polite">
        <span>{current.label}</span>
        <p>{current.description}</p>
      </div>
    </div>
  );
}
