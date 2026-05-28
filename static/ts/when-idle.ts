export const whenIdle = (callback: () => void, timeoutDelay = 200): void => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, { timeout: timeoutDelay });

    return;
  }

  setTimeout(callback, timeoutDelay);
};
