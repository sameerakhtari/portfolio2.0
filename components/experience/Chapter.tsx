"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMotion } from "./MotionProvider";
import {
  pinGeometry,
  scenePhase,
  scrubProgress,
  type ScenePhase,
} from "@/lib/scene-scroll";
import { subscribeScroll } from "@/lib/scroll-observer";

const SceneContext = createContext({
  progress: 1,
  active: true,
  phase: "after" as ScenePhase,
});
export const useScene = () => useContext(SceneContext);

export function Chapter({
  id,
  children,
  className = "",
  color = "#214ee5",
  sticky = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  color?: string;
  sticky?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    progress: 0,
    active: false,
    phase: "before" as ScenePhase,
  });
  const { reduced } = useMotion();
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const panel = pin.current;
    let active = false;
    let geometry = { top: 0, budget: 0 };
    const update = () => {
      const progress =
        reduced || !sticky
          ? 1
          : scrubProgress(
              element.getBoundingClientRect().top,
              geometry.top,
              geometry.budget,
            );
      const phase = scenePhase(progress);
      element.style.setProperty("--scene-progress", String(progress));
      element.dataset.sceneProgress = progress.toFixed(5);
      element.dataset.scenePhase = phase;
      setState((previous) =>
        previous.progress === progress && previous.active === active
          ? previous
          : { progress, active, phase },
      );
    };
    const measure = () => {
      if (panel && sticky && !reduced) {
        const focal =
          panel.querySelector<HTMLElement>("[data-scene-focus]") ?? panel;
        const panelRect = panel.getBoundingClientRect();
        const focalRect = focal.getBoundingClientRect();
        const header =
          document.querySelector<HTMLElement>(".site-header")?.offsetHeight ??
          0;
        geometry = pinGeometry(
          innerHeight,
          header,
          focalRect.top - panelRect.top + focalRect.height / 2,
          innerWidth < 768,
          element.getBoundingClientRect().top + window.scrollY,
        );
        element.style.setProperty("--pin-top", `${geometry.top}px`);
        element.style.setProperty("--pin-height", `${panelRect.height}px`);
        element.style.setProperty("--scroll-budget", `${geometry.budget}px`);
        element.dataset.pinReady = "true";
      } else {
        delete element.dataset.pinReady;
      }
      update();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        update();
      },
      { rootMargin: "100px" },
    );
    observer.observe(element);
    const unsubscribe = subscribeScroll(() => {
      if (active) update();
    });
    const resize = new ResizeObserver(measure);
    if (panel) resize.observe(panel);
    const focal = panel?.querySelector("[data-scene-focus]");
    if (focal) resize.observe(focal);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      resize.disconnect();
      unsubscribe();
      window.removeEventListener("resize", measure);
    };
  }, [id, reduced, sticky]);
  return (
    <SceneContext.Provider
      value={{
        ...state,
        progress: reduced ? 1 : state.progress,
        phase: reduced ? "after" : state.phase,
      }}
    >
      <section
        ref={ref}
        id={id}
        className={`chapter ${sticky ? "chapter-sticky" : ""} ${className}`}
        style={{ "--chapter-color": color } as CSSProperties}
      >
        {sticky ? (
          <div ref={pin} className="chapter-pin">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    </SceneContext.Provider>
  );
}

export function IndexLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="index-label">
      <span>{index}</span>
      <span className="index-line" />
      <span>{children}</span>
    </div>
  );
}
