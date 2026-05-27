function addVideoControls(videoContainers: NodeListOf<Element>): void {
  for (const container of videoContainers) {
    const videoEl = container.querySelector("video");
    const buttonEl = container.querySelector(".video__play-button");

    if (!videoEl || !buttonEl) {
      continue;
    }

    const toggle = (): void => {
      if (videoEl.paused) {
        videoEl.play();
        container.classList.remove("video--paused");

        if (buttonEl) {
          buttonEl.setAttribute("aria-label", "Pause video");
        }
      } else {
        videoEl.pause();
        container.classList.add("video--paused");

        if (buttonEl) {
          buttonEl.setAttribute("aria-label", "Play video");
        }
      }
    };

    const videoSources =
      container.querySelectorAll<HTMLSourceElement>("video source");

    const handleSourceError = (error: ErrorEvent): void => {
      console.error("Failed to load video source", error);

      container.classList.add("video--error");
      container.classList.remove("video--paused");
    };

    for (const sourceEl of videoSources) {
      sourceEl.addEventListener("error", handleSourceError);
    }

    videoEl.addEventListener("click", toggle);

    if (buttonEl) {
      buttonEl.addEventListener("click", toggle);
    }
  }
}

export const setupVideo = (): void => {
  const videoContainers = document.querySelectorAll(".video");

  if (videoContainers.length === 0) {
    return;
  }

  addVideoControls(videoContainers);
};
