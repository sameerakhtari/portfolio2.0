import * as THREE from "three";

/** On-demand software projection of the same Three.js geometry for devices without
 * WebGL2. Painter-sorted faces retain depth; graphite edges remain after coloring.
 * Uses Canvas2D, no second 3D dependency and no external network assets. */
export function createSoftwareRenderer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas renderer");
  let width = 1,
    height = 1;
  type Draw = {
    z: number;
    points: number[];
    color: string;
    line: boolean;
    opacity: number;
  };
  const matrix = new THREE.Matrix4(),
    projection = new THREE.Matrix4(),
    instance = new THREE.Matrix4();
  const point = new THREE.Vector3(),
    normal = new THREE.Vector3(),
    a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3();
  const tint = new THREE.Color(),
    paper = new THREE.Color("#e4e2d8");
  return {
    outputColorSpace: THREE.SRGBColorSpace,
    setClearColor(_color: number, _alpha: number) {
      void _color;
      void _alpha;
    },
    setPixelRatio(_ratio: number) {
      void _ratio;
    },
    setSize(w: number, h: number, _style: boolean) {
      void _style;
      width = Math.round(w);
      height = Math.round(h);
      canvas.width = width;
      canvas.height = height;
    },
    render(scene: THREE.Scene, camera: THREE.Camera) {
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      projection.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      );
      const commands: Draw[] = [];
      scene.traverse((object) => {
        if (
          !(
            object instanceof THREE.Mesh || object instanceof THREE.LineSegments
          ) ||
          !object.visible
        )
          return;
        const geometry = object.geometry,
          position = geometry.getAttribute("position"),
          index = geometry.getIndex();
        if (!position) return;
        const material = Array.isArray(object.material)
          ? object.material[0]
          : object.material;
        const color =
          "color" in material ? (material.color as THREE.Color) : paper;
        const isLine = object instanceof THREE.LineSegments;
        const count = object instanceof THREE.InstancedMesh ? object.count : 1;
        for (let ins = 0; ins < count; ins++) {
          if (object instanceof THREE.InstancedMesh) {
            object.getMatrixAt(ins, instance);
            matrix.multiplyMatrices(object.matrixWorld, instance);
          } else matrix.copy(object.matrixWorld);
          const objectProjection = new THREE.Matrix4().multiplyMatrices(
            projection,
            matrix,
          );
          const total = index ? index.count : position.count,
            step = isLine ? 2 : 3;
          for (let i = 0; i < total; i += step) {
            const points: number[] = [];
            let z = 0,
              cx = 0,
              cz = 0;
            for (let j = 0; j < step; j++) {
              const vertex = index ? index.getX(i + j) : i + j;
              point.fromBufferAttribute(position, vertex);
              cx += point.x;
              cz += point.z;
              if (j === 0) a.copy(point);
              else if (j === 1) b.copy(point);
              else c.copy(point);
              point.applyMatrix4(objectProjection);
              points.push(
                (point.x * 0.5 + 0.5) * width,
                (-point.y * 0.5 + 0.5) * height,
              );
              z += point.z;
            }
            if (points.some((v) => !Number.isFinite(v))) continue;
            if (!isLine) {
              // Back-face culling is sufficient for these closed role geometries.
              const cross =
                (points[2] - points[0]) * (points[5] - points[1]) -
                (points[3] - points[1]) * (points[4] - points[0]);
              if (cross > 0) continue;
              normal
                .subVectors(b, a)
                .cross(c.sub(a))
                .normalize()
                .transformDirection(matrix);
              const light =
                0.73 +
                Math.max(
                  0,
                  normal.dot(new THREE.Vector3(0.3, 0.85, 0.42).normalize()),
                ) *
                  0.27;
              if (material.userData.inkBase) {
                const ink =
                  material.userData.inkCoverage?.(cx / step, cz / step) ?? 1;
                tint
                  .copy(paper)
                  .lerp(material.userData.inkBase, ink)
                  .multiplyScalar(light);
              } else tint.copy(color).multiplyScalar(light);
            } else tint.copy(color);
            commands.push({
              z: z / step - (isLine ? 0.00002 : 0),
              points,
              color: `#${tint.getHexString(THREE.SRGBColorSpace)}`,
              line:
                isLine ||
                ("wireframe" in material && Boolean(material.wireframe)),
              opacity: material.opacity,
            });
          }
        }
      });
      commands.sort((a, b) => b.z - a.z);
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 0.65;
      ctx.lineJoin = "round";
      for (const cmd of commands) {
        ctx.globalAlpha = cmd.opacity;
        ctx.beginPath();
        ctx.moveTo(cmd.points[0], cmd.points[1]);
        for (let i = 2; i < cmd.points.length; i += 2)
          ctx.lineTo(cmd.points[i], cmd.points[i + 1]);
        if (cmd.line) {
          if (cmd.points.length > 4) ctx.closePath();
          ctx.strokeStyle = cmd.color;
          ctx.stroke();
        } else {
          ctx.closePath();
          ctx.fillStyle = cmd.color;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    },
    dispose() {
      ctx.clearRect(0, 0, width, height);
    },
  };
}
