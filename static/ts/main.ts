import { imageSlideIn } from "./slide-images";
import { setupVideo } from "./video-controls";
import { whenIdle } from "./when-idle";

imageSlideIn();
setupVideo();

// Wait for idle after render to load 3D box animation.
whenIdle((): void => {
  import("./boxes").then(({ runBoxes }) => {
    runBoxes();
  });
});
