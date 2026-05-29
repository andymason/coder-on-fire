import { Program, type OGLRenderingContext } from "ogl";

export interface ShaderParams {
  fogStartDensity: number;
  toneMapping: number;
  exposure: number;
  saturation: number;
  contrast: number;
  boxColor: [number, number, number];
  fogColor: [number, number, number];
}

export function createShaderProgram(
  gl: OGLRenderingContext,
  params: ShaderParams,
): Program {
  return new Program(gl, {
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
      uBoxColor: { value: params.boxColor },
      uFogColor: { value: params.fogColor },
    },
  });
}
