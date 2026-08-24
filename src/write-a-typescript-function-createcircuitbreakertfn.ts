// bloom-deps:

type CircuitState = 'closed' | 'open' | 'half-open';

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

function validateOptions(options: unknown): asserts options is { failureThreshold: number; successThreshold: number; timeout: number } {
  if (options === null || options === undefined || typeof options !== 'object') {
    throw new TypeError('options must be a non-null object');
  }

  const opts = options as Record<string, unknown>;

  if (typeof opts.failureThreshold !== 'number' || !isFinite(opts.failureThreshold) || opts.failureThreshold < 1) {
    throw new TypeError('options.failureThreshold must be a finite number >= 1');
  }

  if (typeof opts.successThreshold !== 'number' || !isFinite(opts.successThreshold) || opts.successThreshold < 1) {
    throw new TypeError('options.successThreshold must be a finite number >= 1');
  }

  if (typeof opts.timeout !== 'number' || !isFinite(opts.timeout) || opts.timeout < 0) {
    throw new TypeError('options.timeout must be a finite non-negative number');
  }
}

export function createCircuitBreaker<T>(
  fn: () => Promise<T>,
  options: { failureThreshold: number; successThreshold: number; timeout: number }
): { call: () => Promise<T>; state: () => CircuitState; reset: () => void } {

  validateOptions(options);

  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const { failureThreshold, successThreshold, timeout } = options;

  let currentState: CircuitState = 'closed';
  let failureCount = 0;
  let successCount = 0;
  let openedAt: number | null = null;

  function transitionToOpen(): void {
    currentState = 'open';
    openedAt = Date.now();
    successCount = 0;
  }

  function transitionToClosed(): void {
    currentState = 'closed';
    failureCount = 0;
    successCount = 0;
    openedAt = null;
  }

  function transitionToHalfOpen(): void {
    currentState = 'half-open';
    successCount = 0;
  }

  async function call(): Promise<T> {
    if (currentState === 'open') {
      const now = Date.now();
      if (openedAt !== null && (now - openedAt) >= timeout) {
        transitionToHalfOpen();
      } else {
        throw new Error('Circuit open');
      }
    }

    if (currentState === 'half-open') {
      try {
        const result = await fn();
        successCount += 1;
        if (successCount >= successThreshold) {
          transitionToClosed();
        }
        return result;
      } catch (error) {
        transitionToOpen();
        throw error;
      }
    }

    // closed state
    try {
      const result = await fn();
      failureCount = 0;
      return result;
    } catch (error) {
      failureCount += 1;
      if (failureCount >= failureThreshold) {
        transitionToOpen();
      }
      throw error;
    }
  }

  function state(): CircuitState {
    if (currentState === 'open' && openedAt !== null && (Date.now() - openedAt) >= timeout) {
      transitionToHalfOpen();
    }
    return currentState;
  }

  function reset(): void {
    transitionToClosed();
  }

  return { call, state, reset };
}