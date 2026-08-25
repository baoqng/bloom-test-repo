// bloom-deps:

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
  cause?: unknown;
}

export function withCircuitBreaker(
  fn: () => Promise<unknown>,
  failureThreshold: number,
  resetTimeoutMs: number
): () => Promise<unknown> {
  if (typeof failureThreshold !== 'number' || failureThreshold < 1) {
    throw new TypeError('failureThreshold must be >= 1');
  }
  if (typeof resetTimeoutMs !== 'number' || resetTimeoutMs < 0) {
    throw new TypeError('resetTimeoutMs must be >= 0');
  }

  let state: CircuitState = 'CLOSED';
  let consecutiveFailures = 0;
  let openedAt: number | null = null;

  return async (): Promise<unknown> => {
    if (state === 'OPEN') {
      const now = Date.now();
      if (openedAt !== null && now - openedAt >= resetTimeoutMs) {
        state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit open');
      }
    }

    if (state === 'HALF_OPEN') {
      try {
        const result = await fn();
        state = 'CLOSED';
        consecutiveFailures = 0;
        openedAt = null;
        return result;
      } catch (error) {
        state = 'OPEN';
        openedAt = Date.now();
        throw error;
      }
    }

    // CLOSED state
    try {
      const result = await fn();
      consecutiveFailures = 0;
      return result;
    } catch (error) {
      consecutiveFailures++;
      if (consecutiveFailures >= failureThreshold) {
        state = 'OPEN';
        openedAt = Date.now();
      }
      throw error;
    }
  };
}