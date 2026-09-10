"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMotion } from "./MotionProvider";
import { clamp } from "@/lib/pigment";

const SceneContext = createContext({ progress: 1, active: true });
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
  const [state, setState] = useState({ progress: 0, active: false });
  const { reduced } = useMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0,
      active = false,
      value = 0,
      target = 0;
    const update = () => {
      const rect = element.getBoundingClientRect();
      target =
        id === "init"
          ? clamp(-rect.top / (rect.height * 0.72))
          : clamp((innerHeight * 0.78 - rect.top) / (rect.height * 0.72));
      if (reduced) target = 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      frame = 0;
      const diff = target - value;
      value = Math.abs(diff) < 0.002 ? target : value + diff * 0.12;
      setState({ progress: value, active });
      element.style.setProperty("--scene-progress", String(value));
      if (active && Math.abs(target - value) > 0.002)
        frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        update();
      },
      { rootMargin: "100px" },
    );
    observer.observe(element);
    const onScroll = () => {
      if (active) update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [id, reduced]);
  return (
    <SceneContext.Provider
      value={{ progress: reduced ? 1 : state.progress, active: state.active }}
    >
      <section
        ref={ref}
        id={id}
        className={`chapter ${sticky ? "chapter-sticky" : ""} ${className}`}
        style={{ "--chapter-color": color } as CSSProperties}
      >
        {sticky ? <div className="chapter-pin">{children}</div> : children}
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
