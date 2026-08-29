// bloom-deps:

function applyDebounce<T extends unknown[]>(
  fn: (...args: T) => void,
  waitMs: unknown
): { call: (...args: T) => void; flush: () => void; cancel: () => void } {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof waitMs !== 'number' ||
    !Number.isInteger(waitMs) ||
    waitMs <= 0
  ) {
    throw new TypeError('waitMs must be a positive integer');
  }

  const wait = waitMs as number;

  let timerId: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: T | null = null;

  function call(...args: T): void {
    pendingArgs = args;
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = null;
      const argsToUse = pendingArgs!;
      pendingArgs = null;
      fn(...argsToUse);
    }, wait);
  }

  function flush(): void {
    if (timerId === null || pendingArgs === null) {
      return;
    }
    clearTimeout(timerId);
    timerId = null;
    const argsToUse = pendingArgs;
    pendingArgs = null;
    fn(...argsToUse);
  }

  function cancel(): void {
    if (timerId === null) {
      return;
    }
    clearTimeout(timerId);
    timerId = null;
    pendingArgs = null;
  }

  return { call, flush, cancel };
}

export { applyDebounce };