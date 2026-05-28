export const whenIdle = (callback: () => void, timeoutDelay = 200): void => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, { timeout: timeoutDelay });

    return;
  }

  // Fallback for unsupported browsers
  setTimeout(callback, timeoutDelay);
};
