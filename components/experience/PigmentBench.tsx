"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { LiquidImage } from "./LiquidImage";
import { HardwareScene } from "./HardwareScene";

export function PigmentBench() {
  const [progress, setProgress] = useState(28),
    [missing, setMissing] = useState(false);
  return (
    <main className="page-shell">
      <h1>Pigment study</h1>
      <p>
        Branching arrival field. Compare graphite, wet frontier and material at
        one fixed progress.
      </p>
      <label htmlFor="pigment-progress">Fill: {progress}%</label>
      <Slider
        id="pigment-progress"
        aria-label="Pigment progress"
        value={[progress]}
        min={0}
        max={100}
        onValueChange={(v) => setProgress(v[0])}
      />
      <button
        className="text-link"
        type="button"
        onClick={() => setMissing((v) => !v)}
      >
        {missing ? "Restore image" : "Test missing image"}
      </button>
      <LiquidImage
        key={String(missing)}
        src={
          missing ? "/images/deliberately-missing.webp" : "/images/muet.webp"
        }
        alt="MUET administration building pigment study"
        progress={progress / 100}
      />
      <HardwareScene kind="board" progress={progress / 100} />
    </main>
  );
}
