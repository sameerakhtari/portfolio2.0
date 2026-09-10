"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  labLayers,
  labServices,
  generations,
  type LabLayer,
} from "@/data/homelab";
import { HardwareScene } from "./HardwareScene";
import { MiniDiagram } from "./MiniDiagram";

export function LabExplorer() {
  const [layer, setLayer] = useState<LabLayer>("Physical"),
    [generation, setGeneration] = useState(4),
    [exploded, setExploded] = useState(false);
  const gen = generations[generation - 1];
  const filtered =
    layer === "Physical" || layer === "Network" || layer === "Compute"
      ? labServices
      : labServices.filter(
          (s) =>
            s.layer === layer ||
            (layer === "Smart home" && s.name === "Home Assistant"),
        );
  return (
    <div className="lab-explorer">
      <Tabs
        value={layer}
        onValueChange={(value) => setLayer(value as LabLayer)}
      >
        <TabsList
          className="lab-tabs"
          variant="line"
          aria-label="Homelab layers"
        >
          {labLayers.map((name) => (
            <TabsTrigger key={name} value={name}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
        {labLayers.map((name) => (
          <TabsContent key={name} value={name}>
            <div className="lab-surface">
              <div className="lab-main-view">
                <div className="figure-caption">
                  <span>{name.toUpperCase()} / CURRENT STUDY</span>
                  {name === "Physical" && (
                    <label className="explode-label">
                      Explode
                      <Switch
                        checked={exploded}
                        onCheckedChange={setExploded}
                        aria-label="Explode hardware view"
                        size="sm"
                      />
                    </label>
                  )}
                </div>
                {name === "Physical" ? (
                  <HardwareScene kind="lab" exploded={exploded} progress={1} />
                ) : (
                  <LayerTopology layer={name} generation={4} />
                )}
                <p className="figure-note">
                  {name === "Physical"
                    ? "Hardware roles in a compact side-table lab. Dimensional schematic."
                    : `${name} relationships. Semantic names keep the focus on architecture.`}
                </p>
              </div>
              <aside className="lab-inspector">
                <span className="eyebrow">{name.toUpperCase()} LAYER</span>
                <h3>
                  {name === "Physical"
                    ? "Small footprint. Many systems."
                    : name === "Observability"
                      ? "An unfinished layer."
                      : "Follow the relationships."}
                </h3>
                <div className="lab-service-list">
                  {filtered.map((service) => (
                    <div key={service.name}>
                      <h4>{service.name}</h4>
                      <p>{service.role}</p>
                      <span
                        className={
                          service.status === "IN PROGRESS"
                            ? "status-building"
                            : ""
                        }
                      >
                        {service.status} · {service.host}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="evolution">
        <div>
          <span className="eyebrow">THE LAB WASN’T BUILT IN ONE DAY</span>
          <h3>{gen.name}</h3>
          <p>{gen.detail}</p>
        </div>
        <fieldset>
          <legend>Explore the generations</legend>
          <Slider
            min={1}
            max={4}
            step={1}
            value={[generation]}
            onValueChange={(v) => setGeneration(v[0])}
            aria-label="Lab generation"
          />
          <div className="evolution-labels">
            {generations.map((g) => (
              <button
                type="button"
                key={g.id}
                aria-pressed={g.id === generation}
                onClick={() => setGeneration(g.id)}
              >
                0{g.id}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="generation-map" aria-live="polite">
        <span className="eyebrow">
          GENERATION 0{generation} / CONCEPTUAL MILESTONES
        </span>
        <div>
          {gen.nodes.map((node) => (
            <span key={node}>{node}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LayerTopology({
  layer,
  generation,
}: {
  layer: LabLayer;
  generation: number;
}) {
  const services = labServices.filter(
    (s) =>
      s.layer === layer ||
      (layer === "Smart home" && s.name === "Home Assistant"),
  );
  const core =
    layer === "Network"
      ? generations[generation - 1].nodes
      : layer === "Compute"
        ? ["MAIN SERVER", "DOCKER HOST", "K8S-01", "K8S-02", "K8S-03"]
        : layer === "Storage"
          ? [
              "MIRRORED SSDs",
              "NVMe / CONTAINERS",
              "MEDIA DRIVE",
              "SMB / FILE ACCESS",
            ]
          : services.map((s) => s.name);
  return (
    <div className="layer-topology">
      <MiniDiagram
        kind={
          layer === "Storage"
            ? "storage"
            : layer === "Smart home"
              ? "iot"
              : "network"
        }
        color="var(--teal)"
      />
      <div className="layer-host">
        {layer === "Network"
          ? "CORE SWITCH"
          : layer === "Compute"
            ? "COMPUTE"
            : layer.toUpperCase()}
      </div>
      <div className="layer-branches">
        {core.map((name, i) => (
          <div key={name}>
            <span className="layer-node-index">
              {String(i + 1).padStart(2, "0")}
            </span>
            <strong>{name}</strong>
            {name.includes("Prometheus") && <small>IN PROGRESS</small>}
          </div>
        ))}
      </div>
    </div>
  );
}
