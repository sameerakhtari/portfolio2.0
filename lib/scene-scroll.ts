export type ScenePhase = "before" | "scrubbing" | "after";

/** The same boundaries drive CSS sticky positioning and the animation clock. */
export function pinGeometry(
  viewportHeight: number,
  headerHeight: number,
  focalOffset: number,
  compact: boolean,
  sectionStart = Infinity,
) {
  const focalPoint = headerHeight + (viewportHeight - headerHeight) / 2;
  return {
    top: Math.min(focalPoint - focalOffset, sectionStart),
    budget: Math.max(400, viewportHeight * (compact ? 1 : 1.65)),
  };
}

export function scrubProgress(
  sectionTop: number,
  pinTop: number,
  budget: number,
) {
  if (budget <= 0) return 1;
  return Math.max(0, Math.min(1, (pinTop - sectionTop) / budget));
}

export function scenePhase(progress: number): ScenePhase {
  return progress <= 0 ? "before" : progress >= 1 ? "after" : "scrubbing";
}
