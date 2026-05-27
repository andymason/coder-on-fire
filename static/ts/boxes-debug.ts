import type { Camera, Program, Mesh, Transform } from "ogl";
import { hexToRgb, toneMappedRgb } from "./boxes";
import type { BoxesParams } from "./boxes";

export async function setupDebugGui(
  params: BoxesParams,
  program: Program,
  gl: WebGL2RenderingContext,
  meshes: InstanceType<typeof Mesh>[],
  group: Transform,
  camera: Camera,
  aspect: number,
  abortController: AbortController,
  callbacks: {
    onFogDensityChange: () => void;
    onFogStartDensityChange: () => void;
    onBoxRotationSeedChange: (seed: number) => void;
  },
): Promise<void> {
  const { default: GUI } = await import("lil-gui");

  const gui = new GUI();

  gui
    .add(
      {
        export() {
          navigator.clipboard
            .writeText(JSON.stringify(params, null, 2))
            .then(() => {
              console.log("params copied to clipboard");
            });
        },
      },
      "export",
    )
    .name("Copy params to clipboard");

  const fogFolder = gui.addFolder("Fog");
  fogFolder
    .addColor(params, "fogColor")
    .name("Color")
    .onChange((v: string) => {
      const rgb = hexToRgb(v);
      program.uniforms.uFogColor.value = rgb;
      const c = toneMappedRgb(
        rgb,
        params.exposure,
        params.saturation,
        params.contrast,
      );
      gl.clearColor(c[0], c[1], c[2], 1);
    });

  fogFolder
    .add(params, "fogDensity", 0, 2, 0.01)
    .name("Density (near ⇠ ⇢ far)")
    .onChange((v: number) => {
      callbacks.onFogDensityChange();
      program.uniforms.uFogDensity.value = v;
    });

  fogFolder
    .add(params, "fogStartDensity", 0, 10, 0.1)
    .name("Start density")
    .onChange(() => {
      callbacks.onFogStartDensityChange();
    });

  fogFolder.add(params, "tweenSpeed", 0.001, 0.1, 0.001).name("Tween speed");

  const toneFolder = gui.addFolder("Tone mapping / lighting");
  toneFolder
    .add(params, "toneMapping", {
      None: 0,
      Linear: 1,
      Reinhard: 2,
      Cineon: 3,
      "ACES Filmic": 4,
      AgX: 5,
    })
    .name("Curve")
    .onChange((v: number) => {
      program.uniforms.uToneMapping.value = Number(v);
    });

  toneFolder
    .add(params, "exposure", 0.1, 16, 0.1)
    .name("Exposure (blow out)")
    .onChange((v: number) => {
      program.uniforms.uExposure.value = v;
      const c = toneMappedRgb(
        hexToRgb(params.fogColor),
        v,
        params.saturation,
        params.contrast,
      );
      gl.clearColor(c[0], c[1], c[2], 1);
    });

  toneFolder
    .add(params, "saturation", 0, 3, 0.01)
    .name("Saturation")
    .onChange((v: number) => {
      program.uniforms.uSaturation.value = v;
      const c = toneMappedRgb(
        hexToRgb(params.fogColor),
        params.exposure,
        v,
        params.contrast,
      );
      gl.clearColor(c[0], c[1], c[2], 1);
    });

  toneFolder
    .add(params, "contrast", 0, 3, 0.01)
    .name("Contrast")
    .onChange((v: number) => {
      program.uniforms.uContrast.value = v;
      const c = toneMappedRgb(
        hexToRgb(params.fogColor),
        params.exposure,
        params.saturation,
        v,
      );
      gl.clearColor(c[0], c[1], c[2], 1);
    });

  const boxFolder = gui.addFolder("Boxes");
  boxFolder
    .addColor(params, "boxColor")
    .name("Color")
    .onChange((v: string) => {
      program.uniforms.uBoxColor.value = hexToRgb(v);
    });

  boxFolder
    .add(params, "boxScale", 0.1, 2, 0.01)
    .name("Scale")
    .onChange((v: number) => {
      for (const cube of meshes) {
        cube.scale.set(v, v, v);
      }
    });

  boxFolder
    .add(params, "boxRotationSeed", 0, 9999, 1)
    .name("Rotation seed")
    .onChange((v: number) => {
      callbacks.onBoxRotationSeedChange(v);
    });

  boxFolder.add(params, "waveAmplitude", 0, 2, 0.01).name("Wave amplitude");
  boxFolder.add(params, "waveSpread", 0, 1, 0.01).name("Wave spread");

  const groupFolder = gui.addFolder("Group");
  groupFolder
    .add(params, "groupX", -5, 10, 0.01)
    .name("X")
    .onChange((v: number) => {
      group.position.x = v;
    });

  groupFolder
    .add(params, "groupY", -10, 5, 0.01)
    .name("Y")
    .onChange((v: number) => {
      group.position.y = v;
    });

  const camFolder = gui.addFolder("Camera");
  camFolder
    .add(params, "camFov", 10, 120, 1)
    .name("FOV")
    .onChange(() => camera.perspective({ fov: params.camFov, aspect }));

  camFolder
    .add(params, "camX", -5, 5, 0.001)
    .name("Pos X")
    .onChange(() => {
      camera.position.x = params.camX;
    });

  camFolder
    .add(params, "camY", -5, 5, 0.001)
    .name("Pos Y")
    .onChange(() => {
      camera.position.y = params.camY;
    });

  camFolder
    .add(params, "camZ", -5, 5, 0.001)
    .name("Pos Z")
    .onChange(() => {
      camera.position.z = params.camZ;
    });

  camFolder
    .add(params, "camRotX", -Math.PI, Math.PI, 0.001)
    .name("Rot X")
    .onChange(() => {
      camera.rotation.x = params.camRotX;
    });

  camFolder
    .add(params, "camRotY", -Math.PI, Math.PI, 0.001)
    .name("Rot Y")
    .onChange(() => {
      camera.rotation.y = params.camRotY;
    });

  camFolder
    .add(params, "camRotZ", -Math.PI, Math.PI, 0.001)
    .name("Rot Z")
    .onChange(() => {
      camera.rotation.z = params.camRotZ;
    });

  // Clean up the GUI along with everything else.
  abortController.signal.addEventListener("abort", () => gui.destroy());
}
