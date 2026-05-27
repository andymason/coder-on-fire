const checkIntersection: IntersectionObserverCallback = (entries, observer) => {
  const transitionCSSClass = "slide";
  const transitionUpCSSClass = "slide--up";

  // WHICH DIRECTION? Different class

  for (const entry of entries) {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains(transitionCSSClass)) {
        entry.target.classList.add(transitionUpCSSClass);
      }

      observer.unobserve(entry.target);
    } else if (entry.target.classList.contains(transitionCSSClass) === false) {
      entry.target.classList.add(transitionCSSClass);
    }
  }
};

export function imageSlideIn(): void {
  const intersectionOptions: IntersectionObserverInit = {
    root: null,
    threshold: 0.2,
  };

  const intersectionObserver = new IntersectionObserver(
    checkIntersection,
    intersectionOptions,
  );

  const intersectionTargets = document.querySelectorAll(
    "main > figure, main > video, main > p > img, .project-item",
  );

  for (const element of intersectionTargets) {
    intersectionObserver.observe(element);
  }
}
