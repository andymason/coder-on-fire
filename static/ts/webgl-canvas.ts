// Software rasterisers: SwiftShader (Chrome), llvmpipe/softpipe (Mesa) and
// Microsoft Basic Render Driver (Windows). They run WebGL on the CPU and
// block the main thread.
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|software|basic render/iu;

const getRendererName = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
): string => {
  const renderer = String(gl.getParameter(gl.RENDERER));

  // Chrome and Safari mask RENDERER. Firefox returns the real name and has
  // deprecated the debug extension, so only ask for it when masked.
  if (renderer !== "WebKit WebGL") {
    return renderer;
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

  return debugInfo
    ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
    : renderer;
};

// Returns a canvas with a hardware-accelerated WebGL context, or null when
// WebGL is unavailable or software rendered. The attributes match ogl's
// Renderer defaults so ogl reuses this context instead of creating another.
export const createHardwareWebGLCanvas = (): HTMLCanvasElement | null => {
  const canvas = document.createElement("canvas");
  const attributes: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  };
  const gl =
    canvas.getContext("webgl2", attributes) ??
    canvas.getContext("webgl", attributes);

  if (!gl || SOFTWARE_RENDERER.test(getRendererName(gl))) {
    return null;
  }

  return canvas;
};
