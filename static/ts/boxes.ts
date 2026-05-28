import { Renderer, Camera, Transform, Box, Program, Mesh } from "ogl";
import { mulberry32 } from "./random";

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

  // glsl shader
  const program = new Program(gl, {
    vertex: `
      attribute vec3 position;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      varying float vFogDepth;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vFogDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragment: `
      precision highp float;

      uniform float uFogDensity;
      uniform float uToneMapping;
      uniform float uExposure;
      uniform float uSaturation;
      uniform float uContrast;
      uniform vec3 uBoxColor;
      uniform vec3 uFogColor;

      varying float vFogDepth;

      vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
      vec3 toSrgb(vec3 c)   { return pow(c, vec3(1.0 / 2.2)); }

      vec3 rrtAndOdtFit(vec3 v) {
        vec3 a = v * (v + 0.0245786) - 0.000090537;
        vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
        return a / b;
      }

      // Three.js ACESFilmicToneMapping. Unlike per-channel linear exposure, the
      // matrix mixes channels so bright colors desaturate toward white — this is
      // what gives the blown-out, overexposed highlight even for a pure-green box.
      vec3 acesFilmic(vec3 color, float exposure) {
        const mat3 inputMat = mat3(
          0.59719, 0.07600, 0.02840,
          0.35458, 0.90834, 0.13383,
          0.04823, 0.01566, 0.83777
        );
        const mat3 outputMat = mat3(
           1.60475, -0.10208, -0.00327,
          -0.53108,  1.10813, -0.07276,
          -0.07367, -0.00605,  1.07602
        );
        color *= exposure / 0.6;
        color = inputMat * color;
        color = rrtAndOdtFit(color);
        color = outputMat * color;
        return clamp(color, 0.0, 1.0);
      }

      vec3 linearToneMapping(vec3 color, float exposure) {
        return clamp(color * exposure, 0.0, 1.0);
      }

      vec3 reinhardToneMapping(vec3 color, float exposure) {
        color *= exposure;
        return clamp(color / (vec3(1.0) + color), 0.0, 1.0);
      }

      vec3 cineonToneMapping(vec3 color, float exposure) {
        color *= exposure;
        color = max(vec3(0.0), color - 0.004);
        return pow((color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06), vec3(2.2));
      }

      vec3 agxContrastApprox(vec3 x) {
        vec3 x2 = x * x;
        vec3 x4 = x2 * x2;
        return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4
          - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
      }

      // Three.js AgXToneMapping. Gentle, filmic roll-off with strong hue stability
      // through a Rec.2020 working space — useful for pushing the over-exposed look.
      vec3 agxToneMapping(vec3 color, float exposure) {
        const mat3 toRec2020 = mat3(
          0.6274, 0.0691, 0.0164,
          0.3293, 0.9195, 0.0880,
          0.0433, 0.0113, 0.8956
        );
        const mat3 fromRec2020 = mat3(
           1.6605, -0.1246, -0.0182,
          -0.5876,  1.1329, -0.1006,
          -0.0728, -0.0083,  1.1187
        );
        const mat3 agxInset = mat3(
          0.856627153315983, 0.137318972929847, 0.11189821299995,
          0.0951212405381588, 0.761241990602591, 0.0767994186031903,
          0.0482516061458583, 0.101439036467562, 0.811302368396859
        );
        const mat3 agxOutset = mat3(
           1.1271005818144368, -0.1413297634984383, -0.14132976349843826,
          -0.11060664309660323,  1.157823702216272, -0.11060664309660294,
          -0.016493938717834573, -0.016493938717834257, 1.2519364065950405
        );
        const float minEv = -12.47393;
        const float maxEv = 4.026069;

        color *= exposure;
        color = toRec2020 * color;
        color = max(vec3(0.0), color);
        color = agxInset * color;
        color = max(color, 1e-10);
        color = log2(color);
        color = (color - minEv) / (maxEv - minEv);
        color = clamp(color, 0.0, 1.0);
        color = agxContrastApprox(color);
        color = agxOutset * color;
        color = pow(max(vec3(0.0), color), vec3(2.2));
        color = fromRec2020 * color;
        return clamp(color, 0.0, 1.0);
      }

      vec3 applyToneMapping(vec3 color, float mode, float exposure) {
        if (mode < 0.5) return clamp(color, 0.0, 1.0);
        if (mode < 1.5) return linearToneMapping(color, exposure);
        if (mode < 2.5) return reinhardToneMapping(color, exposure);
        if (mode < 3.5) return cineonToneMapping(color, exposure);
        if (mode < 4.5) return acesFilmic(color, exposure);
        return agxToneMapping(color, exposure);
      }

      vec3 applySaturation(vec3 color, float s) {
        float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
        return clamp(mix(vec3(luma), color, s), 0.0, 1.0);
      }

      vec3 applyContrast(vec3 color, float c) {
        return clamp((color - 0.5) * c + 0.5, 0.0, 1.0);
      }

      void main() {
        float fogFactor = exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
        fogFactor = clamp(fogFactor, 0.0, 1.0);

        vec3 boxLinear = toLinear(uBoxColor);
        vec3 fogLinear = toLinear(uFogColor);

        // Mix fog in linear space first, THEN tone map the final color — matches
        // the Three.js pipeline, where tone mapping runs after fog. Saturation and
        // contrast are creative grades applied in display space.
        vec3 color = mix(fogLinear, boxLinear, fogFactor);
        color = applyToneMapping(color, uToneMapping, uExposure);
        color = toSrgb(color);
        color = applySaturation(color, uSaturation);
        color = applyContrast(color, uContrast);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uFogDensity: { value: params.fogStartDensity },
      uToneMapping: { value: params.toneMapping },
      uExposure: { value: params.exposure },
      uSaturation: { value: params.saturation },
      uContrast: { value: params.contrast },
      uBoxColor: { value: hexToRgb(params.boxColor) },
      uFogColor: { value: hexToRgb(params.fogColor) },
    },
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
      const cube = new Mesh(gl, { geometry, program });

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

  function easeOutCirc(t: number): number {
    const t1 = t - 1;

    return Math.sqrt(1 - t1 * t1);
  }

  let tweenVal = 0;
  let startTime = 0;

  function animate(timestamp: number): void {
    requestAnimationFrame(animate);

    if (startTime === 0) startTime = timestamp;

    if (tweenVal < 1) {
      tweenVal = Math.min(tweenVal + params.tweenSpeed, 1);
      program.uniforms.uFogDensity.value =
        params.fogStartDensity -
        (params.fogStartDensity - params.fogDensity) * easeOutCirc(tweenVal);
    }

    if (window.scrollY < window.innerHeight) {
      const time = (timestamp - startTime) * 0.001;

      meshes.forEach((cube, i) => {
        cube.position.z =
          Math.sin(time + i * params.waveSpread) * params.waveAmplitude;
      });

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
        program,
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
