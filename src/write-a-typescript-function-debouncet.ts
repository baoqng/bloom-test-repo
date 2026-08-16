// bloom-deps:

type DebouncedFunction<T extends (...args: unknown[]) => void> = T & {
  cancel: () => void;
};

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
): DebouncedFunction<T> {
  // Input validation: fn must be a function
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  // Input validation: delayMs must be a non-negative number
  if (
    typeof delayMs !== "number" ||
    !Number.isInteger(delayMs) ||
    delayMs < 0
  ) {
    throw new TypeError("delayMs must be a non-negative integer");
  }

  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: unknown[] | null = null;

  const debounced = ((...args: unknown[]) => {
    lastArgs = args;

    // Clear any pending invocation
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Schedule the function call
    timeoutId = setTimeout(() => {
      if (lastArgs !== null) {
        fn(...lastArgs);
      }
      timeoutId = null;
      lastArgs = null;
    }, delayMs);
  }) as DebouncedFunction<T>;

  // Attach cancel method to allow clearing pending invocations
  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  return debounced;
}

export { debounce };