import { Renderer, Camera, Transform, Box, Mesh } from "ogl";
import { mulberry32 } from "./random";
import { createShaderProgram } from "./shader";

declare const __DEV__: boolean;

export function hexToRgb(hex: string): [number, number, number] {
  if (!/^#[0-9a-fA-F]{6}$/u.test(hex)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return [
    Number.parseInt(hex.slice(1, 3), 16) / 255,
    Number.parseInt(hex.slice(3, 5), 16) / 255,
    Number.parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

const applyMatrix = (matrix: number[][], vector: number[]): number[] => {
  return matrix.map(
    (row) => row[0] * vector[0] + row[1] * vector[1] + row[2] * vector[2],
  );
};

const applyRrtOdt = (color: number[]): number[] => {
  return color.map(
    (channel) =>
      (channel * (channel + 0.0245786) - 0.000090537) /
      (channel * (0.983729 * channel + 0.432951) + 0.238081),
  );
};

const easeOutCirc = (t: number): number => {
  const t1 = t - 1;

  return Math.sqrt(1 - t1 * t1);
};

// Mirror the shader's ACES tone mapping so the cleared background matches boxes
// that have fully faded into fog. Steps: sRGB -> linear, ACES (with exposure),
// then linear -> sRGB. Matrices are the row-form (transposed) of the GLSL ones.
export function toneMappedRgb(
  rgb: [number, number, number],
  exposure: number,
  saturation: number,
  contrast: number,
): number[] {
  const rgbToAces = [
    [0.59719, 0.35458, 0.04823],
    [0.076, 0.90834, 0.01566],
    [0.0284, 0.13383, 0.83777],
  ];
  const acesToRgb = [
    [1.60475, -0.10208, -0.00327],
    [-0.53108, 1.10813, -0.07276],
    [-0.07367, -0.00605, 1.07602],
  ];

  let color = rgb.map((channel) => Math.pow(channel, 2.2) * (exposure / 0.6));

  color = applyMatrix(rgbToAces, color);
  color = applyRrtOdt(color);
  color = applyMatrix(acesToRgb, color);

  // To SRGB
  color = color.map((linearChannel) => {
    return Math.pow(Math.min(Math.max(linearChannel, 0), 1), 1.0 / 2.2);
  });

  // Apply saturation (matches fragment shader post-processing)
  const luma = color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;
  color = color.map((c) => {
    const val = luma + (c - luma) * saturation;
    return Math.min(Math.max(val, 0), 1);
  });

  // Apply contrast (matches fragment shader post-processing)
  color = color.map((c) => {
    const val = (c - 0.5) * contrast + 0.5;
    return Math.min(Math.max(val, 0), 1);
  });

  return color;
}

export interface BoxesParams {
  fogColor: string;
  fogDensity: number;
  fogStartDensity: number;
  tweenSpeed: number;
  toneMapping: number;
  exposure: number;
  saturation: number;
  contrast: number;
  boxColor: string;
  boxScale: number;
  waveAmplitude: number;
  waveSpread: number;
  groupX: number;
  groupY: number;
  camFov: number;
  camX: number;
  camY: number;
  camZ: number;
  camRotX: number;
  camRotY: number;
  camRotZ: number;
  boxRotationSeed: number;
}

export function runBoxes(): () => void {
  const isDev = new URLSearchParams(window.location.search).has("dev");

  let width = window.innerWidth;
  let height = window.innerHeight / 1.1;
  let aspect = width / height;

  const params: BoxesParams = {
    fogColor: "#000014",
    fogDensity: 1.04,
    fogStartDensity: 3,
    tweenSpeed: 0.005,
    toneMapping: 4,
    exposure: 8.4,
    saturation: 0.93,
    contrast: 1.05,
    boxColor: "#00dd89",
    boxScale: 0.58,
    waveAmplitude: 0.16,
    waveSpread: 0.11,
    groupX: 2.44,
    groupY: -2.56,
    camFov: 70,
    camX: 0.698,
    camY: 1.558,
    camZ: 2.173,
    camRotX: -0.951592653589793,
    camRotY: -0.0805926535897932,
    camRotZ: -0.468439,
    boxRotationSeed: 4960,
  };

  const renderer = new Renderer({
    powerPreference: "low-power",
  });
  const gl = renderer.gl;
  renderer.setSize(width, height);
  gl.canvas.setAttribute("class", "box_animation");
  document.body.prepend(gl.canvas);

  const clearRgb = toneMappedRgb(
    hexToRgb(params.fogColor),
    params.exposure,
    params.saturation,
    params.contrast,
  );
  gl.clearColor(clearRgb[0], clearRgb[1], clearRgb[2], 1);

  const camera = new Camera(gl, {
    fov: params.camFov,
    aspect,
    near: 0.1,
    far: 1000,
  });
  camera.position.set(params.camX, params.camY, params.camZ);
  camera.rotation.x = params.camRotX;
  camera.rotation.y = params.camRotY;
  camera.rotation.z = params.camRotZ;

  const scene = new Transform();
  const group = new Transform();

  const geometry = new Box(gl);

  const glslProgram = createShaderProgram(gl, {
    fogStartDensity: params.fogStartDensity,
    toneMapping: params.toneMapping,
    exposure: params.exposure,
    saturation: params.saturation,
    contrast: params.contrast,
    boxColor: hexToRgb(params.boxColor),
    fogColor: hexToRgb(params.fogColor),
  });

  // Sine-wave cascade of tilt across the grid. Boxes lean most in the middle
  // of each axis and ease off toward the edges, with a little random jitter
  // to break up the wave's uniformity.
  const boxTiltAmplitude = 0.45;
  const boxJitter = 0.26;

  // Only create meshes for rows 4–8 of the original 9×10 grid (50 boxes).
  // These correspond to indices 40–89 from the previous full-grid allocation.
  const meshes: InstanceType<typeof Mesh>[] = [];
  const rng = mulberry32(params.boxRotationSeed);

  for (let rowIndex = 4; rowIndex < 9; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
      const cube = new Mesh(gl, { geometry, program: glslProgram });

      cube.position.y = rowIndex / 2;
      cube.position.x = (columnIndex / 2) * -1;
      cube.scale.set(params.boxScale, params.boxScale, params.boxScale);

      const normRow = (rowIndex - 4) / 4;
      const normCol = columnIndex / 9;

      cube.rotation.x =
        Math.sin(normCol * Math.PI) * boxTiltAmplitude +
        (rng() - 0.5) * boxJitter;
      cube.rotation.y =
        Math.sin(normRow * Math.PI) * boxTiltAmplitude +
        (rng() - 0.5) * boxJitter;
      cube.rotation.z =
        Math.sin(normRow * Math.PI) * boxTiltAmplitude +
        (rng() - 0.5) * boxJitter;
      cube.setParent(group);

      meshes.push(cube);
    }
  }

  group.setParent(scene);
  group.position.set(params.groupX, params.groupY, 0);

  function applyBoxRotations(seed: number): void {
    const rng = mulberry32(seed);
    let index = 0;

    for (const mesh of meshes) {
      const rowIndex = 4 + Math.floor(index / 10);
      const columnIndex = index % 10;
      const normRow = (rowIndex - 4) / 4;
      const normCol = columnIndex / 9;

      mesh.rotation.x =
        Math.sin(normCol * Math.PI) * boxTiltAmplitude +
        (rng() - 0.5) * boxJitter;
      mesh.rotation.y =
        Math.sin(normRow * Math.PI) * boxTiltAmplitude +
        (rng() - 0.5) * boxJitter;
      mesh.rotation.z = (rng() - 0.5) * boxJitter;
      index++;
    }
  }

  // z-offset formula keeps the block group at a consistent visual depth
  // regardless of aspect ratio. The constants 2.18 and 5 come from initial
  // visual tuning against common viewport sizes.
  function setBlockHeight(): void {
    group.position.z = (2.18 - aspect) / 5;
  }
  setBlockHeight();

  let tweenVal = 0;
  let startTime = 0;

  function animate(timestamp: number): void {
    requestAnimationFrame(animate);

    if (startTime === 0) startTime = timestamp;

    if (tweenVal < 1) {
      tweenVal = Math.min(tweenVal + params.tweenSpeed, 1);
      glslProgram.uniforms.uFogDensity.value =
        params.fogStartDensity -
        (params.fogStartDensity - params.fogDensity) * easeOutCirc(tweenVal);
    }

    if (window.scrollY < window.innerHeight) {
      const time = (timestamp - startTime) * 0.001;

      let meshCount = 0;
      for (const cube of meshes) {
        cube.position.z =
          Math.sin(time + meshCount * params.waveSpread) * params.waveAmplitude;
        meshCount += 1;
      }

      renderer.render({ scene, camera });
    }
  }

  function onWindowResize(): void {
    const newWidth = window.innerWidth;

    // Mobile address bar show/hide causes resize events and jitter.
    // So, ignore if width is the same.
    if (newWidth === width) {
      return;
    }

    width = window.innerWidth;
    height = window.innerHeight / 1.1;
    aspect = width / height;
    camera.perspective({ aspect });
    setBlockHeight();
    renderer.setSize(width, height);
  }

  const abortController = new AbortController();
  window.addEventListener("resize", onWindowResize, {
    signal: abortController.signal,
  });
  requestAnimationFrame(animate);

  const destroy = (): void => {
    abortController.abort();
    gl.canvas.remove();
  };

  if (__DEV__ && isDev) {
    import("./boxes-debug").then(({ setupDebugGui }) => {
      setupDebugGui(
        params,
        glslProgram,
        gl,
        meshes,
        group,
        camera,
        aspect,
        abortController,
        {
          onFogDensityChange() {
            // Skip tween, apply immediately.
            tweenVal = 1;
          },
          onFogStartDensityChange() {
            tweenVal = 0;
          },
          onBoxRotationSeedChange(seed: number) {
            applyBoxRotations(seed);
          },
        },
      );
    });
  }

  return destroy;
}
