import * as THREE from "three";
import { arrivalAt, clamp, coverage, pigmentGLSL } from "./pigment";
import { createSoftwareRenderer } from "./software-renderer";

export type HardwareKind = "board" | "lab" | "cluster";
export type HardwareControls = {
  progress: number;
  active: boolean;
  reduced: boolean;
  exploded: boolean;
};

/** A dimensional engineering diagram. Geometry represents functional hardware roles,
 * not a claimed exact replica of an undocumented motherboard or server chassis. */
export function createHardwareScene(
  canvas: HTMLCanvasElement,
  kind: HardwareKind,
) {
  let context: WebGL2RenderingContext | null = null;
  try {
    context = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    /* software path */
  }
  const software = !context;
  const renderer = context
    ? new THREE.WebGLRenderer({
        canvas,
        context,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      })
    : createSoftwareRenderer(canvas);
  canvas.dataset.renderer = software ? "software-3d" : "webgl";
  renderer.setClearColor(0xf2efe6, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 100);
  camera.position.set(8, 9, 12);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xfff8ec, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 3.1);
  key.position.set(3, 8, 4);
  scene.add(key);
  const group = new THREE.Group();
  scene.add(group);
  const uniforms: { value: number }[] = [];
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const phaseOffsets: number[] = [];
  let visible = true,
    frame = 0,
    controls: HardwareControls = {
      progress: 0,
      active: true,
      reduced: false,
      exploded: false,
    };
  let xTarget = 0,
    yTarget = 0,
    px = 0,
    py = 0,
    lastProgress = -1,
    lastExplode = -1;
  const movable: {
    object: THREE.Object3D;
    origin: THREE.Vector3;
    lift: number;
  }[] = [];
  const pods: { mesh: THREE.InstancedMesh; count: number; index: number }[] =
    [];
  const up = new THREE.Vector3(0, 1, 0);

  function material(color: string, phase = 0, metalness = 0.15) {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness,
    });
    mat.userData.inkBase = new THREE.Color(color);
    mat.userData.inkPhase = phase;
    const progress = { value: 0 };
    uniforms.push(progress);
    phaseOffsets.push(phase);
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.inkProgress = progress;
      shader.vertexShader =
        "varying vec3 vInkPosition;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvInkPosition = position;",
      );
      shader.fragmentShader =
        "uniform float inkProgress; varying vec3 vInkPosition;\n" +
        pigmentGLSL +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
      vec2 inkUV=vec2(vInkPosition.x*.3+.5,vInkPosition.z*.3+.5);
      float ink=inkMask(inkUV,inkProgress);
      float hatch=step(.86,fract((vInkPosition.x+vInkPosition.y+vInkPosition.z)*24.));
      vec3 graphite=vec3(.85,.84,.8)-hatch*.055;
      float wet=1.-smoothstep(.005,.04,abs(inkArrival(inkUV)-inkProgress*1.6));
      diffuseColor.rgb=mix(graphite,diffuseColor.rgb*(1.-wet*.16),ink);`,
      );
    };
    mat.customProgramCacheKey = () => "sameer-pigment-v1";
    materials.push(mat);
    return mat;
  }
  function mesh(
    geometry: THREE.BufferGeometry,
    mat: THREE.Material,
    parent: THREE.Group,
    position: number[],
    edges = true,
  ) {
    geometries.push(geometry);
    const obj = new THREE.Mesh(geometry, mat);
    obj.position.set(position[0], position[1], position[2]);
    parent.add(obj);
    if (edges) {
      const edgeGeo = new THREE.EdgesGeometry(geometry, 25);
      geometries.push(edgeGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x333b40,
        transparent: true,
        opacity: 0.45,
      });
      materials.push(edgeMat);
      obj.add(new THREE.LineSegments(edgeGeo, edgeMat));
    }
    return obj;
  }
  function box(
    w: number,
    h: number,
    d: number,
    color: string,
    parent: THREE.Group,
    position: number[],
    phase = 0,
  ) {
    return mesh(
      new THREE.BoxGeometry(w, h, d),
      material(color, phase),
      parent,
      position,
    );
  }
  function line(
    points: THREE.Vector3[],
    color: number,
    parent: THREE.Group,
    thickness = 0.014,
  ) {
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    const geometry = new THREE.TubeGeometry(
      curve,
      software ? 8 : 32,
      thickness,
      software ? 3 : 5,
      false,
    );
    geometries.push(geometry);
    const mat = material("#" + color.toString(16).padStart(6, "0"), 0.08);
    const obj = new THREE.Mesh(geometry, mat);
    parent.add(obj);
    return obj;
  }
  function motherboard(
    parent: THREE.Group,
    index: number,
    position: number[],
    scale = 1,
  ) {
    const board = new THREE.Group();
    board.position.set(...(position as [number, number, number]));
    board.scale.setScalar(scale);
    parent.add(board);
    const phase = index * 0.1;
    const shape = new THREE.Shape();
    shape.moveTo(-1.55, -1);
    shape.lineTo(1.25, -1);
    shape.lineTo(1.25, -0.65);
    shape.lineTo(1.62, -0.65);
    shape.lineTo(1.62, 0.65);
    shape.lineTo(0.9, 0.65);
    shape.lineTo(0.9, 1);
    shape.lineTo(-1.55, 1);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.09,
      bevelEnabled: false,
    });
    geo.rotateX(-Math.PI / 2);
    mesh(
      geo,
      material(index === 1 ? "#476865" : "#276361", phase),
      board,
      [0, 0, 0],
    );
    box(0.8, 0.12, 0.7, "#2e333b", board, [-0.25, 0.15, -0.16], phase + 0.06);
    const chip = box(
      0.42,
      0.07,
      0.42,
      "#b3b6ac",
      board,
      [-0.25, 0.24, -0.16],
      phase + 0.08,
    );
    movable.push({ object: chip, origin: chip.position.clone(), lift: 0.8 });
    for (let i = 0; i < 2; i++) {
      const ram = box(
        1.05,
        0.06,
        0.22,
        "#333f39",
        board,
        [0.15, 0.12, 0.5 + i * 0.29],
        phase + 0.1,
      );
      for (let j = 0; j < 5; j++)
        box(
          0.13,
          0.045,
          0.13,
          "#20272b",
          board,
          [-0.26 + j * 0.2, 0.17, 0.5 + i * 0.29],
          phase + 0.12,
        );
      movable.push({ object: ram, origin: ram.position.clone(), lift: 0.4 });
    }
    for (let i = 0; i < 5; i++)
      box(
        0.28,
        0.22,
        0.2,
        "#a3a9a3",
        board,
        [-1.35 + i * 0.58, 0.18, -0.9],
        phase + 0.1,
      );
    const fan = mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.14, 28),
      material("#2f3537", phase + 0.06),
      board,
      [0.98, 0.2, -0.15],
    );
    for (let i = 0; i < 9; i++) {
      const a = (i * Math.PI * 2) / 9;
      const blade = box(
        0.32,
        0.015,
        0.05,
        "#8a9490",
        board,
        [0.98 + Math.cos(a) * 0.2, 0.28, -0.15 + Math.sin(a) * 0.2],
        phase + 0.06,
      );
      blade.rotation.y = -a;
    }
    movable.push({ object: fan, origin: fan.position.clone(), lift: 0.55 });
    line(
      [
        new THREE.Vector3(-0.25, 0.29, -0.16),
        new THREE.Vector3(0.1, 0.33, -0.4),
        new THREE.Vector3(0.7, 0.32, -0.4),
        new THREE.Vector3(0.98, 0.28, -0.15),
      ],
      0xb48547,
      board,
      0.045,
    );
    for (let i = 0; i < 10; i++) {
      const x = -1.1 + (i % 5) * 0.35,
        z = -0.45 + Math.floor(i / 5) * 0.6;
      box(0.09, 0.04, 0.06, "#4c5052", board, [x, 0.12, z], phase + 0.08);
      line(
        [
          new THREE.Vector3(x, 0.1, z),
          new THREE.Vector3(x + 0.14, 0.1, z),
          new THREE.Vector3(x + 0.25, 0.1, z + 0.11),
        ],
        0xa69364,
        board,
        0.006,
      );
    }
    for (const [x, z] of [
      [-1.4, 0.85],
      [1.05, -0.8],
      [-1.4, -0.83],
      [0.7, 0.85],
    ])
      mesh(
        new THREE.TorusGeometry(0.055, 0.018, 6, 16).rotateX(Math.PI / 2),
        material("#b0a26e", phase),
        board,
        [x, 0.11, z],
        false,
      );
    if (kind === "cluster") {
      const count = [99, 93, 98][index];
      const cellGeo = new THREE.BoxGeometry(0.074, 0.055, 0.074);
      geometries.push(cellGeo);
      const cellMat = new THREE.MeshBasicMaterial({ color: 0x315fd6 });
      materials.push(cellMat);
      const cells = new THREE.InstancedMesh(cellGeo, cellMat, count);
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        dummy.position.set(
          -0.7 + (i % 10) * 0.14,
          0.5 + Math.floor(i / 50) * 0.1,
          -0.47 + Math.floor((i % 50) / 10) * 0.18,
        );
        dummy.updateMatrix();
        cells.setMatrixAt(i, dummy.matrix);
      }
      board.add(cells);
      cells.count = 0;
      pods.push({ mesh: cells, count, index });
    }
    return board;
  }

  if (kind === "board") {
    const board = motherboard(group, 0, [0, 0, 0], 1.55);
    board.rotation.y = -0.28;
    const planeGeo = new THREE.PlaneGeometry(6.2, 4.1, 8, 6);
    planeGeo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x747b76,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    });
    materials.push(mat);
    mesh(planeGeo, mat, group, [0, -0.65, 0], false);
    line(
      [
        new THREE.Vector3(-3, -0.65, 2),
        new THREE.Vector3(-2, -0.65, 1.8),
        new THREE.Vector3(-2, -0.1, 0.8),
        new THREE.Vector3(-1, 0, 0.8),
      ],
      0x244fdd,
      group,
    );
  } else if (kind === "cluster") {
    for (let i = 0; i < 3; i++) {
      const b = motherboard(group, i, [(i - 1) * 3.5, 0, i === 1 ? -0.3 : 0]);
      b.rotation.y = (i - 1) * 0.04;
    }
    line(
      [
        new THREE.Vector3(-4, 0.05, 1.2),
        new THREE.Vector3(-4, -0.4, 1.8),
        new THREE.Vector3(0, -0.4, 1.8),
        new THREE.Vector3(0, 0.05, 1.2),
      ],
      0x2455d7,
      group,
    );
    line(
      [
        new THREE.Vector3(0, 0.05, 1.2),
        new THREE.Vector3(0, -0.4, 1.8),
        new THREE.Vector3(4, -0.4, 1.8),
        new THREE.Vector3(4, 0.05, 1.2),
      ],
      0x2455d7,
      group,
    );
    camera.position.set(6, 11, 15);
    camera.lookAt(0, 0, 0);
  } else {
    // The real role arrangement: router/switches above compact general and cluster compute.
    box(6.4, 0.18, 3.2, "#a9865c", group, [0, -1.1, 0], 0);
    for (const x of [-2.8, 2.8])
      for (const z of [-1.25, 1.25])
        box(0.12, 1.1, 0.12, "#544b42", group, [x, -1.7, z], 0);
    const server = box(
      2.5,
      0.82,
      2.3,
      "#424c51",
      group,
      [-0.95, -0.55, 0],
      0.2,
    );
    for (let i = 0; i < 12; i++)
      box(
        0.025,
        0.5,
        0.035,
        "#171d21",
        group,
        [-1.92 + i * 0.105, -0.52, 1.17],
        0.23,
      );
    box(0.32, 0.12, 0.06, "#adb2b1", group, [-0.32, -0.35, 1.18], 0.23);
    box(2.2, 0.26, 1.2, "#315664", group, [-0.95, 0.06, 0], 0.1);
    for (let i = 0; i < 8; i++)
      box(
        0.14,
        0.09,
        0.06,
        "#a3a9a4",
        group,
        [-1.82 + i * 0.25, 0.06, 0.64],
        0.12,
      );
    const router = box(
      1.35,
      0.23,
      1.1,
      "#707879",
      group,
      [-0.95, 0.34, 0],
      0.035,
    );
    for (let i = 0; i < 3; i++)
      box(
        0.13,
        0.07,
        0.05,
        "#232c2e",
        group,
        [-1.38 + i * 0.24, 0.33, 0.58],
        0.04,
      );
    box(1.25, 0.16, 0.72, "#e5e1d4", group, [-0.95, 0.56, 0], 0.07);
    const clusterBase = box(
      2.3,
      1.15,
      2.2,
      "#435152",
      group,
      [1.9, -0.38, 0],
      0.35,
    );
    for (let i = 0; i < 3; i++) {
      const b = motherboard(group, i, [1.9, -0.7 + i * 0.35, 0], 0.6);
      movable.push({
        object: b,
        origin: b.position.clone(),
        lift: 0.8 + i * 0.3,
      });
    }
    movable.push(
      { object: server, origin: server.position.clone(), lift: -0.22 },
      { object: router, origin: router.position.clone(), lift: 0.6 },
      { object: clusterBase, origin: clusterBase.position.clone(), lift: -0.1 },
    );
    line(
      [
        new THREE.Vector3(-3.2, 0.1, 1.5),
        new THREE.Vector3(-2.6, 0.6, 1.2),
        new THREE.Vector3(-1.25, 0.35, 0.8),
      ],
      0x267d78,
      group,
      0.022,
    );
    line(
      [
        new THREE.Vector3(-1.6, 0.15, 0.65),
        new THREE.Vector3(-2.2, 0.1, 0.9),
        new THREE.Vector3(-2.2, -0.5, 1.4),
        new THREE.Vector3(-1, -0.6, 1.3),
      ],
      0x356e8e,
      group,
      0.022,
    );
    line(
      [
        new THREE.Vector3(-0.3, 0.15, 0.65),
        new THREE.Vector3(0.4, 0.05, 1.5),
        new THREE.Vector3(1.65, -0.4, 1.3),
      ],
      0xb1813b,
      group,
      0.022,
    );
  }

  const originalPosition = group.position.clone();
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    renderer.setPixelRatio(
      software ? 1 : Math.min(devicePixelRatio, rect.width < 600 ? 1.25 : 1.5),
    );
    renderer.setSize(rect.width, rect.height, false);
    const aspect = rect.width / rect.height;
    const span =
      kind === "cluster"
        ? Math.max(1.65, 5.8 / aspect)
        : kind === "lab"
          ? Math.max(2.55, 4.2 / aspect)
          : Math.max(2.9, 2.9 / aspect);
    camera.left = -span * aspect;
    camera.right = span * aspect;
    camera.top = span;
    camera.bottom = -span;
    camera.updateProjectionMatrix();
    requestRender();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const pointer = (event: PointerEvent) => {
    if (event.pointerType === "touch" || controls.reduced) return;
    const rect = canvas.getBoundingClientRect();
    xTarget = (event.clientX - rect.left) / rect.width - 0.5;
    yTarget = (event.clientY - rect.top) / rect.height - 0.5;
    requestRender();
  };
  const leave = () => {
    xTarget = 0;
    yTarget = 0;
    requestRender();
  };
  canvas.addEventListener("pointermove", pointer);
  canvas.addEventListener("pointerleave", leave);
  const onVisibility = () => {
    visible = !document.hidden;
    if (visible) requestRender();
  };
  document.addEventListener("visibilitychange", onVisibility);
  function requestRender() {
    if (!frame && visible && controls.active)
      frame = requestAnimationFrame(draw);
  }
  function draw() {
    frame = 0;
    if (!visible || !controls.active) return;
    const p = controls.reduced ? 1 : controls.progress;
    px += (xTarget - px) * 0.08;
    py += (yTarget - py) * 0.08;
    group.rotation.y = px * 0.1;
    group.rotation.x = py * 0.035;
    group.position.copy(originalPosition);
    for (let i = 0; i < uniforms.length; i++)
      uniforms[i].value = clamp((p - phaseOffsets[i]) / (1 - phaseOffsets[i]));
    if (software)
      for (const mat of materials) {
        if (mat instanceof THREE.MeshStandardMaterial && mat.userData.inkBase) {
          const phase = mat.userData.inkPhase;
          const localProgress = clamp((p - phase) / (1 - phase));
          mat.userData.inkProgress = localProgress;
          mat.userData.inkCoverage = (x: number, z: number) =>
            coverage(arrivalAt(x * 0.3 + 0.5, z * 0.3 + 0.5), localProgress);
        }
      }
    const explode = controls.exploded
      ? 1
      : kind === "board"
        ? 0.45 * (1 - p)
        : 0;
    for (const item of movable)
      item.object.position
        .copy(item.origin)
        .addScaledVector(up, item.lift * explode);
    for (const pod of pods)
      pod.mesh.count = Math.round(
        pod.count * clamp((p - 0.3 - pod.index * 0.1) / 0.4),
      );
    renderer.render(scene, camera);
    lastProgress = p;
    lastExplode = explode;
    if (Math.abs(xTarget - px) > 0.002 || Math.abs(yTarget - py) > 0.002)
      requestRender();
  }
  resize();
  return {
    update(next: HardwareControls) {
      const needs =
        next.progress !== lastProgress ||
        next.exploded !== Boolean(lastExplode) ||
        next.active !== controls.active ||
        next.reduced !== controls.reduced;
      controls = next;
      if (needs) requestRender();
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", pointer);
      canvas.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      for (const p of pods) p.mesh.dispose();
      renderer.dispose();
    },
  };
}
