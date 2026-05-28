export const whenIdle = (callback: () => void, timoutDelay = 200): void => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, { timeout: timoutDelay });

    return;
  }

  setTimeout(callback, timoutDelay);
};
