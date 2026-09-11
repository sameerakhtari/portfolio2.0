const subscribers = new Set<() => void>();
let frame = 0;

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    for (const update of subscribers) update();
  });
}

/** One passive listener and one scheduled frame for all visible scenes. */
export function subscribeScroll(update: () => void) {
  if (subscribers.size === 0)
    window.addEventListener("scroll", schedule, { passive: true });
  subscribers.add(update);
  return () => {
    subscribers.delete(update);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
