/** Shared arrival field for raster, SVG regions and 3D material shaders.
 * A distance-to-capillary field gives branched, local growth instead of a wipe.
 * Noise is seeded and spatial: reverse scrolling retraces the same wet frontier.
 */
export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
export type Point = readonly [number, number];
export type Capillary = {
  from: Point;
  to: Point;
  arrival: number;
  travel: number;
};
export const capillaries: Capillary[] = [
  { from: [0.12, 0.8], to: [0.36, 0.49], arrival: 0, travel: 0.18 },
  { from: [0.36, 0.49], to: [0.72, 0.48], arrival: 0.18, travel: 0.2 },
  { from: [0.36, 0.49], to: [0.3, 0.15], arrival: 0.18, travel: 0.2 },
  { from: [0.48, 0.49], to: [0.67, 0.8], arrival: 0.24, travel: 0.16 },
  { from: [0.72, 0.48], to: [0.91, 0.17], arrival: 0.38, travel: 0.12 },
  { from: [0.72, 0.48], to: [0.94, 0.72], arrival: 0.38, travel: 0.12 },
];

const fract = (n: number) => n - Math.floor(n);
function hash(x: number, y: number, seed: number) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 17.3) * 43758.5453);
}
export function noise(x: number, y: number, seed = 7): number {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    fx = fract(x),
    fy = fract(y);
  const ux = fx * fx * (3 - 2 * fx),
    uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed),
    b = hash(ix + 1, iy, seed),
    c = hash(ix, iy + 1, seed),
    d = hash(ix + 1, iy + 1, seed);
  return (
    a * (1 - ux) * (1 - uy) +
    b * ux * (1 - uy) +
    c * (1 - ux) * uy +
    d * ux * uy
  );
}
export function arrivalAt(x: number, y: number, seed = 7): number {
  let arrival = 2;
  // Spatial noise is shared by all channels at this point; compute it once.
  const n =
    noise(x * 10, y * 10, seed) * 0.09 + noise(x * 36, y * 36, seed) * 0.032;
  const spread = 1.9 + noise(x * 4, y * 4, seed) * 0.8;
  for (const channel of capillaries) {
    const dx = channel.to[0] - channel.from[0],
      dy = channel.to[1] - channel.from[1];
    const t = clamp(
      ((x - channel.from[0]) * dx + (y - channel.from[1]) * dy) /
        (dx * dx + dy * dy),
    );
    const distance = Math.hypot(
      x - channel.from[0] - dx * t,
      y - channel.from[1] - dy * t,
    );
    arrival = Math.min(
      arrival,
      channel.arrival + t * channel.travel + distance * spread + n,
    );
  }
  return arrival;
}
export function coverage(
  arrival: number,
  progress: number,
  softness = 0.025,
): number {
  if (progress >= 0.999) return 1;
  if (progress <= 0.001) return 0;
  return clamp((progress * 1.6 - arrival) / softness + 0.5);
}

export const pigmentGLSL = `
float inkHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)) + 121.1) * 43758.5453); }
float inkNoise(vec2 p) {
 vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
 return mix(mix(inkHash(i),inkHash(i+vec2(1.,0.)),f.x),mix(inkHash(i+vec2(0.,1.)),inkHash(i+vec2(1.,1.)),f.x),f.y);
}
float inkBranch(vec2 p,vec2 a,vec2 b,float start,float travel) {
 vec2 ba=b-a; float t=clamp(dot(p-a,ba)/dot(ba,ba),0.,1.);
 float d=length(p-a-ba*t);
 return start+t*travel+d*(1.9+inkNoise(p*4.)*.8);
}
float inkArrival(vec2 p) {
 float f=inkBranch(p,vec2(.12,.8),vec2(.36,.49),0.,.18);
 f=min(f,inkBranch(p,vec2(.36,.49),vec2(.72,.48),.18,.2));
 f=min(f,inkBranch(p,vec2(.36,.49),vec2(.3,.15),.18,.2));
 f=min(f,inkBranch(p,vec2(.48,.49),vec2(.67,.8),.24,.16));
 f=min(f,inkBranch(p,vec2(.72,.48),vec2(.91,.17),.38,.12));
 f=min(f,inkBranch(p,vec2(.72,.48),vec2(.94,.72),.38,.12));
 return f+inkNoise(p*10.)*.09+inkNoise(p*36.)*.032;
}
float inkMask(vec2 p,float progress) {
 if(progress<.001)return 0.; if(progress>.999)return 1.;
 float field=inkArrival(p);
 return 1.-smoothstep(progress*1.6-.015,progress*1.6+.015,field);
}
`;
