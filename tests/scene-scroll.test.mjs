import test from "node:test";
import assert from "node:assert/strict";
import { pinGeometry, scrubProgress, scenePhase } from "../lib/scene-scroll.ts";

test("visual stays unfilled until its focal point reaches the pin boundary", () => {
  const opening = pinGeometry(800, 86, 333, false, 86);
  assert.equal(
    opening.top,
    86,
    "opening pin cannot start above document scroll zero",
  );
  assert.equal(scrubProgress(86, opening.top, opening.budget), 0);
  for (const [height, header, offset, compact] of [
    [936, 86, 540, false],
    [800, 72, 600, true],
  ]) {
    const { top, budget } = pinGeometry(height, header, offset, compact);
    assert.equal(top + offset, header + (height - header) / 2);
    assert.equal(scrubProgress(top + 200, top, budget), 0);
    assert.equal(scrubProgress(top, top, budget), 0);
    assert.equal(scenePhase(0), "before");
    assert.equal(scrubProgress(top - budget / 2, top, budget), 0.5);
    assert.equal(scrubProgress(top - budget, top, budget), 1);
    assert.equal(scrubProgress(top - budget - 200, top, budget), 1);
    assert.equal(scenePhase(1), "after");
  }
});

test("pin geometry releases continuously and reverse scrolling retraces every value", () => {
  const panelHeight = 1100;
  const { top, budget } = pinGeometry(800, 72, 600, true);
  const wrapperHeight = panelHeight + budget;
  const samples = Array.from({ length: 21 }, (_, i) => top - (budget * i) / 20);
  const forward = samples.map((y) => scrubProgress(y, top, budget));
  for (let i = 1; i < forward.length; i++)
    assert.ok(forward[i] >= forward[i - 1]);
  assert.deepEqual(
    [...samples].reverse().map((y) => scrubProgress(y, top, budget)),
    [...forward].reverse(),
  );
  assert.equal(samples.at(-1) + wrapperHeight, top + panelHeight);
  assert.equal(scrubProgress(-500, 0, 0), 1);
});
