import test from "node:test";
import assert from "node:assert/strict";
import { arrivalAt, coverage } from "../lib/pigment.ts";
import { edgePath } from "../lib/diagram-path.ts";
import { projects } from "../data/projects.ts";
import { labNotes } from "../data/notes.ts";
import { clusterSnapshot, labServices, labLayers } from "../data/homelab.ts";
import {
  productionNodes,
  productionEdges,
  workflowNodes,
  workflowEdges,
} from "../data/diagrams.ts";

test("pigment starts as graphite and finishes completely, including image corners", () => {
  for (let y = 0; y <= 20; y++)
    for (let x = 0; x <= 20; x++) {
      const arrival = arrivalAt(x / 20, y / 20);
      assert.ok(Number.isFinite(arrival));
      assert.equal(coverage(arrival, 0), 0);
      assert.equal(coverage(arrival, 1), 1);
    }
});

test("scroll reverses the same frontier without random flicker or lost coverage", () => {
  for (let y = 0; y <= 10; y++)
    for (let x = 0; x <= 10; x++) {
      let previous = 0;
      const forward = [];
      for (let step = 0; step <= 20; step++) {
        const value = coverage(arrivalAt(x / 10, y / 10), step / 20);
        assert.ok(value >= previous && value <= 1);
        forward.push(value);
        previous = value;
      }
      for (let step = 20; step >= 0; step--)
        assert.equal(
          coverage(arrivalAt(x / 10, y / 10), step / 20),
          forward[step],
        );
    }
});

test("color follows a capillary before a distant point on the same column", () => {
  assert.ok(arrivalAt(0.12, 0.8) < arrivalAt(0.12, 0.1));
  assert.equal(coverage(arrivalAt(0.12, 0.8), 0.2), 1);
  assert.equal(coverage(arrivalAt(0.12, 0.1), 0.2), 0);
  const mixed = Array.from({ length: 400 }, (_, i) =>
    coverage(arrivalAt((i % 20) / 19, Math.floor(i / 20) / 19), 0.28),
  );
  assert.ok(mixed.some((v) => v === 0) && mixed.some((v) => v === 1));
});

test("the CSV return path connects facing edges without crossing node interiors", () => {
  const data = workflowNodes.find((n) => n.id === "data");
  const csv = workflowNodes.find((n) => n.id === "csv");
  assert.equal(
    edgePath(data, csv),
    `M${data.x - 70} ${data.y}L${csv.x + 70} ${csv.y}`,
  );
});

test("every diagram relationship has existing endpoints and a causal arrival order", () => {
  for (const [nodes, edges] of [
    [productionNodes, productionEdges],
    [workflowNodes, workflowEdges],
  ]) {
    assert.equal(new Set(nodes.map((n) => n.id)).size, nodes.length);
    for (const edge of edges) {
      const from = nodes.find((n) => n.id === edge.from),
        to = nodes.find((n) => n.id === edge.to);
      assert.ok(from && to);
      if (!edge.disabled) assert.ok(to.arrival > from.arrival);
    }
  }
  assert.ok(!productionEdges.some((e) => e.from === "dns" && e.to === "edge"));
  assert.ok(workflowEdges.find((e) => e.to === "sheets").disabled);
  assert.ok(!workflowEdges.find((e) => e.to === "delivery").disabled);
});

test("public records have unique routable slugs and complete case-study content", () => {
  for (const records of [projects, labNotes]) {
    assert.equal(new Set(records.map((r) => r.slug)).size, records.length);
    for (const record of records)
      assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
  for (const project of projects) {
    assert.ok(project.summary.length > 30 && project.sections.length >= 3);
    assert.equal(
      new Set(project.sections.map((s) => s.heading)).size,
      project.sections.length,
    );
    for (const link of project.links ?? [])
      assert.match(link.href, /^https:\/\/github\.com\//);
  }
  for (const service of labServices)
    assert.ok(labLayers.includes(service.layer));
});

test("historical workload totals and unfinished observability remain consistent", () => {
  assert.equal(
    clusterSnapshot.nodes.reduce((sum, n) => sum + n.pods, 0),
    clusterSnapshot.totalPods,
  );
  assert.equal(clusterSnapshot.totalPods, 290);
  assert.equal(
    projects.find((p) => p.slug === "observability").status,
    "IN PROGRESS",
  );
  assert.equal(
    labServices.find((s) => s.name.includes("Prometheus")).status,
    "IN PROGRESS",
  );
  assert.equal(labServices.find((s) => s.name === "Netdata").status, "ACTIVE");
});
