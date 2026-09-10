"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Switch } from "@/components/ui/switch";

const MotionContext = createContext({ reduced: true });
export const useMotion = () => useContext(MotionContext);
const query = "(prefers-reduced-motion: reduce)";
let temporaryPaused = false;
const subscribeSystem = (notify: () => void) => {
  const media = matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const subscribePreference = (notify: () => void) => {
  window.addEventListener("storage", notify);
  window.addEventListener("sameer-motion-change", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("sameer-motion-change", notify);
  };
};
const readPreference = () => {
  try {
    return localStorage.getItem("sameer-motion") === "paused";
  } catch {
    return temporaryPaused;
  }
};

export function MotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = useSyncExternalStore(
    subscribeSystem,
    () => matchMedia(query).matches,
    () => true,
  );
  const paused = useSyncExternalStore(
    subscribePreference,
    readPreference,
    () => false,
  );
  const reduced = systemReduced || paused;
  return (
    <MotionContext.Provider value={{ reduced }}>
      <div data-motion={reduced ? "reduced" : "full"}>{children}</div>
      <div className="motion-control">
        <label htmlFor="motion-switch">Motion</label>
        <Switch
          id="motion-switch"
          size="sm"
          checked={!reduced}
          disabled={systemReduced}
          aria-label={
            systemReduced
              ? "Motion disabled by system preference"
              : "Enable animation"
          }
          onCheckedChange={(checked) => {
            temporaryPaused = !checked;
            try {
              localStorage.setItem(
                "sameer-motion",
                checked ? "full" : "paused",
              );
            } catch {
              /* The in-memory preference still works. */
            }
            window.dispatchEvent(new Event("sameer-motion-change"));
          }}
        />
      </div>
    </MotionContext.Provider>
  );
}
