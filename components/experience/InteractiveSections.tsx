"use client";
import { useState } from "react";
import Link from "next/link";
import { domains, experience } from "@/data/profile";
import { projects } from "@/data/projects";
import { clusterSnapshot } from "@/data/homelab";
import { HardwareScene } from "./HardwareScene";
import { useScene } from "./Chapter";
import { useMotion } from "./MotionProvider";
import { MiniDiagram } from "./MiniDiagram";
import { Switch } from "@/components/ui/switch";
import { clamp } from "@/lib/pigment";

export function CareerEvolution() {
  const [selected, setSelected] = useState(3);
  return (
    <div className="career-evolution">
      <div className="career-track" aria-label="Explore career stages">
        {experience.map((item, index) => (
          <button
            key={item.year}
            type="button"
            className={selected === index ? "is-selected" : ""}
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
          >
            <span className="career-year">{item.year}</span>
            <span className="career-circuit" aria-hidden="true">
              {Array.from({ length: item.complexity * 2 }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            <strong>{item.company}</strong>
            <small>{item.role}</small>
          </button>
        ))}
      </div>
      <div className="career-readout" aria-live="polite">
        <span>{experience[selected].period}</span>
        <p>{experience[selected].scope}</p>
        <div>
          {experience[selected].domains.map((d) => (
            <b key={d}>{d}</b>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LabPreview() {
  const [exploded, setExploded] = useState(false);
  return (
    <div className="lab-preview">
      <div className="scene-annotation top-left">
        <span>FIG. 03 / PERSONAL INFRASTRUCTURE</span>
        <p>
          Built on a side table.
          <br /> Connected like a system.
        </p>
      </div>
      <label className="explode-label scene-toggle">
        Exploded view{" "}
        <Switch
          checked={exploded}
          onCheckedChange={setExploded}
          aria-label="Show exploded homelab view"
          size="sm"
        />
      </label>
      <HardwareScene kind="lab" exploded={exploded} />
      <div className="hardware-key">
        <span>
          <b>01</b> pfSense router
        </span>
        <span>
          <b>02</b> Ethernet switching
        </span>
        <span>
          <b>03</b> Linux home server
        </span>
        <span>
          <b>04</b> Kubernetes hardware
        </span>
      </div>
    </div>
  );
}

export function ClusterVisual() {
  const { progress } = useScene();
  const { reduced } = useMotion();
  const total = Math.round(
    clusterSnapshot.totalPods * (reduced ? 1 : clamp((progress - 0.3) / 0.5)),
  );
  return (
    <div className="cluster-visual">
      <HardwareScene kind="cluster" />
      <div className="node-readouts">
        {clusterSnapshot.nodes.map((node, index) => (
          <div key={node.name}>
            <span>{node.name}</span>
            <strong>{node.cpu}</strong>
            <small>{node.memory} RAM</small>
            <div className="pod-matrix" aria-hidden="true">
              {Array.from({ length: node.pods }, (_, i) => (
                <i
                  key={i}
                  className={
                    i <
                    Math.round(
                      node.pods *
                        (reduced
                          ? 1
                          : clamp((progress - 0.3 - index * 0.1) / 0.4)),
                    )
                      ? "pod-active"
                      : ""
                  }
                />
              ))}
            </div>
            <small>{node.pods} PODS / RECORDED TEST</small>
          </div>
        ))}
      </div>
      <div className="cluster-counter">
        <strong>{total.toString().padStart(3, "0")}</strong>
        <p>
          RUNNING PODS
          <br /> <span>in the documented load test</span>
        </p>
      </div>
    </div>
  );
}

export function DomainMap() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="domain-map">
      <div className="domain-center">
        <span>SA</span>
        <small>CONNECTED PRACTICE</small>
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeDasharray="2 4"
          />
          <path d="M0 50H100M50 0V100" stroke="currentColor" opacity=".18" />
        </svg>
      </div>
      <div className="domain-list" aria-label="Engineering domains">
        {domains.map((domain, index) => (
          <button
            key={domain.name}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={index === selected}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {domain.name}
            <b aria-hidden="true">{index === selected ? "−" : "+"}</b>
          </button>
        ))}
      </div>
      <div className="domain-detail" aria-live="polite">
        <span className="eyebrow">
          {domains[selected].practice.toUpperCase()}
        </span>
        <h3>{domains[selected].name}</h3>
        <p>{domains[selected].note}</p>
        <ul>
          {domains[selected].tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProjectIndex() {
  const [filter, setFilter] = useState("ALL");
  const categories = ["ALL", ...new Set(projects.map((p) => p.domain))];
  const visible = projects.filter(
    (p) => filter === "ALL" || p.domain === filter,
  );
  return (
    <>
      <div className="project-filters" aria-label="Filter projects by domain">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
          >
            {category}
            <span>
              {category === "ALL"
                ? projects.length
                : projects.filter((p) => p.domain === category).length}
            </span>
          </button>
        ))}
      </div>
      <p className="result-count" aria-live="polite">
        {visible.length} {visible.length === 1 ? "system" : "systems"} /{" "}
        {filter.toLowerCase()}
      </p>
      <div className="project-records">
        {visible.map((project) => (
          <Link
            href={`/projects/${project.slug}`}
            className="project-record"
            key={project.slug}
            style={{ "--project-color": project.color } as React.CSSProperties}
          >
            <div className="project-record-index">
              <span>{project.index}</span>
              <small>{project.year}</small>
            </div>
            <div className="project-record-visual">
              <MiniDiagram kind={project.diagram} color={project.color} />
            </div>
            <div className="project-record-copy">
              <div className="project-record-meta">
                <span>{project.domain}</span>
                <span
                  className={
                    project.status === "IN PROGRESS" ? "status-building" : ""
                  }
                >
                  {project.status}
                </span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <div className="tech-line">
                {project.technologies.slice(0, 4).join(" / ")}
              </div>
            </div>
            <span className="project-open" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
