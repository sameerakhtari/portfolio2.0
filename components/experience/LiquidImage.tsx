"use client";
/* eslint-disable @next/next/no-img-element -- The canvas and native fallback share a preoptimized local texture. */

import { useEffect, useRef, useState } from "react";
import { arrivalAt, coverage, pigmentGLSL } from "@/lib/pigment";
import { useScene } from "./Chapter";
import { useMotion } from "./MotionProvider";

const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=vec2((position.x+1.)*.5,(1.-position.y)*.5);gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float; varying vec2 uv; uniform sampler2D colorMap; uniform sampler2D sketchMap; uniform float progress; ${pigmentGLSL}
void main(){vec3 paper=vec3(.949,.937,.902);vec3 color=texture2D(colorMap,uv).rgb;vec3 sketch=texture2D(sketchMap,uv).rgb;
float field=inkArrival(uv);float mask=inkMask(uv,progress);float wet=1.-smoothstep(.005,.034,abs(field-progress*1.6));
if(progress<.001||progress>.999)wet=0.;
vec3 pigment=color*(1.-wet*.15);vec3 drawing=mix(paper,sketch,smoothstep(0.,.18,progress)+.26);
gl_FragColor=vec4(mix(drawing,pigment,mask),1.);}`;

/** Locally hosted image → Sobel graphite drawing → noisy branching pigment frontier. */
export function LiquidImage({
  src,
  alt,
  progress: override,
}: {
  src: string;
  alt: string;
  progress?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { progress, active } = useScene();
  const { reduced } = useMotion();
  const render = useRef<((p: number) => void) | null>(null);
  const current = useRef(0);
  useEffect(() => {
    const surface = canvas.current;
    if (!surface) return;
    let disposed = false;
    let cleanup = () => {};
    const source = new Image();
    source.decoding = "async";
    source.onload = () => {
      if (disposed) return;
      const width = Math.min(1280, source.width),
        height = Math.round((width * source.height) / source.width);
      surface.width = width;
      surface.height = height;
      const sketch = document.createElement("canvas");
      sketch.width = width;
      sketch.height = height;
      const ctx = sketch.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(source, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height),
        gray = new Float32Array(width * height);
      for (let i = 0; i < gray.length; i++)
        gray[i] =
          data.data[i * 4] * 0.299 +
          data.data[i * 4 + 1] * 0.587 +
          data.data[i * 4 + 2] * 0.114;
      for (let y = 1; y < height - 1; y++)
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x,
            dx =
              -gray[i - width - 1] -
              2 * gray[i - 1] -
              gray[i + width - 1] +
              gray[i - width + 1] +
              2 * gray[i + 1] +
              gray[i + width + 1],
            dy =
              -gray[i - width - 1] -
              2 * gray[i - width] -
              gray[i - width + 1] +
              gray[i + width - 1] +
              2 * gray[i + width] +
              gray[i + width + 1];
          const edge = Math.min(0.9, Math.hypot(dx, dy) / 225),
            shade = (Math.max(0, 170 - gray[i]) / 255) * 0.3;
          const strength = Math.min(0.9, edge * 0.76 + shade);
          data.data[i * 4] = 242 * (1 - strength) + 25 * strength;
          data.data[i * 4 + 1] = 239 * (1 - strength) + 27 * strength;
          data.data[i * 4 + 2] = 230 * (1 - strength) + 29 * strength;
        }
      ctx.putImageData(data, 0, 0);
      let gl: WebGLRenderingContext | null = null;
      try {
        gl = surface.getContext("webgl", {
          alpha: false,
          antialias: false,
          powerPreference: "low-power",
        });
      } catch {
        /* canvas fallback */
      }
      if (gl) {
        const g = gl;
        const compile = (type: number, code: string) => {
          const shader = g.createShader(type)!;
          g.shaderSource(shader, code);
          g.compileShader(shader);
          if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) {
            g.deleteShader(shader);
            throw new Error("Pigment shader compile failed");
          }
          return shader;
        };
        try {
          const vs = compile(g.VERTEX_SHADER, vertex),
            fs = compile(g.FRAGMENT_SHADER, fragment),
            program = g.createProgram()!;
          g.attachShader(program, vs);
          g.attachShader(program, fs);
          g.linkProgram(program);
          if (!g.getProgramParameter(program, g.LINK_STATUS))
            throw new Error("Pigment shader link failed");
          g.useProgram(program);
          const buffer = g.createBuffer();
          g.bindBuffer(g.ARRAY_BUFFER, buffer);
          g.bufferData(
            g.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            g.STATIC_DRAW,
          );
          const pos = g.getAttribLocation(program, "position");
          g.enableVertexAttribArray(pos);
          g.vertexAttribPointer(pos, 2, g.FLOAT, false, 0, 0);
          const textures = [source, sketch].map((image, index) => {
            const t = g.createTexture();
            g.activeTexture(g.TEXTURE0 + index);
            g.bindTexture(g.TEXTURE_2D, t);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
            g.texImage2D(g.TEXTURE_2D, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, image);
            g.uniform1i(
              g.getUniformLocation(program, index ? "sketchMap" : "colorMap"),
              index,
            );
            return t;
          });
          const p = g.getUniformLocation(program, "progress");
          render.current = (value) => {
            g.viewport(0, 0, surface.width, surface.height);
            g.uniform1f(p, value);
            g.drawArrays(g.TRIANGLES, 0, 6);
          };
          cleanup = () => {
            for (const t of textures) g.deleteTexture(t);
            g.deleteBuffer(buffer);
            g.deleteProgram(program);
            g.deleteShader(vs);
            g.deleteShader(fs);
          };
          const lost = (event: Event) => {
            event.preventDefault();
            setReady(false);
          };
          surface.addEventListener("webglcontextlost", lost);
          const gpuCleanup = cleanup;
          cleanup = () => {
            surface.removeEventListener("webglcontextlost", lost);
            gpuCleanup();
          };
        } catch {
          setReady(false);
          return;
        }
      } else {
        const c = surface.getContext("2d");
        if (!c) return;
        const w = Math.min(520, width),
          h = Math.round((w * height) / width);
        surface.width = w;
        surface.height = h;
        const colorCanvas = document.createElement("canvas");
        colorCanvas.width = w;
        colorCanvas.height = h;
        const colorCtx = colorCanvas.getContext("2d")!;
        colorCtx.drawImage(source, 0, 0, w, h);
        const colors = colorCtx.getImageData(0, 0, w, h);
        colorCtx.drawImage(sketch, 0, 0, w, h);
        const lines = colorCtx.getImageData(0, 0, w, h);
        const output = c.createImageData(w, h);
        const field = Float32Array.from({ length: w * h }, (_, i) =>
          arrivalAt((i % w) / w, Math.floor(i / w) / h),
        );
        render.current = (value) => {
          for (let i = 0; i < field.length; i++) {
            const mix = coverage(field[i], value);
            for (let channel = 0; channel < 3; channel++)
              output.data[i * 4 + channel] =
                lines.data[i * 4 + channel] * (1 - mix) +
                colors.data[i * 4 + channel] * mix;
            output.data[i * 4 + 3] = 255;
          }
          c.putImageData(output, 0, 0);
        };
      }
      render.current?.(current.current);
      setReady(true);
    };
    source.onerror = () => {
      if (!disposed) setFailed(true);
    };
    source.src = src;
    return () => {
      disposed = true;
      source.onload = null;
      source.onerror = null;
      cleanup();
      render.current = null;
    };
  }, [src]);
  useEffect(() => {
    const value = reduced ? 1 : (override ?? progress);
    current.current = value;
    if (active || override !== undefined || reduced) render.current?.(value);
  }, [active, override, progress, reduced]);
  return (
    <div className="liquid-image" role="img" aria-label={alt}>
      {/* The actual image also provides no-WebGL and image-decoding fallbacks. */}
      {!failed && (
        <img
          src={src}
          alt=""
          width="1672"
          height="941"
          loading="lazy"
          decoding="async"
          className={ready ? "liquid-source hidden-source" : "liquid-source"}
        />
      )}
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={ready ? "liquid-canvas is-ready" : "liquid-canvas"}
      />
      {failed && (
        <div className="image-fallback">
          <span>MEHRAN UNIVERSITY</span>
          <p>Software engineering, Jamshoro.</p>
        </div>
      )}
    </div>
  );
}
