import { imageSlideIn } from "./slide-images";
import { setupVideo } from "./video-controls";
import { createHardwareWebGLCanvas } from "./webgl-canvas";
import { whenIdle } from "./when-idle";

const showBoxesFallback = (): void => {
  document.documentElement.classList.add("show-boxes-fallback");
};

imageSlideIn();
setupVideo();

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  showBoxesFallback();
} else {
  // Wait for idle after render to load 3D box animation.
  whenIdle((): void => {
    const canvas = createHardwareWebGLCanvas();

    // Show the still image without downloading the animation code
    if (!canvas) {
      showBoxesFallback();

      return;
    }

    import("./boxes").then(({ runBoxes }) => {
      runBoxes(canvas);
    });
  });
}
