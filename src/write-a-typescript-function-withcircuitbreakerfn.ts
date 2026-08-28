// bloom-deps:

type CircuitState = 'closed' | 'open' | 'half-open';

export function withCircuitBreaker(
  fn: () => Promise<unknown>,
  failureThreshold: number,
  resetTimeoutMs: number
): () => Promise<unknown> {
  if (failureThreshold < 1) {
    throw new TypeError('failureThreshold must be >= 1');
  }
  if (resetTimeoutMs < 0) {
    throw new TypeError('resetTimeoutMs must be >= 0');
  }

  let state: CircuitState = 'closed';
  let consecutiveFailures = 0;
  let openedAt: number | null = null;

  return async function (): Promise<unknown> {
    if (state === 'open') {
      const now = Date.now();
      if (openedAt !== null && now - openedAt >= resetTimeoutMs) {
        state = 'half-open';
      } else {
        throw new Error('Circuit open');
      }
    }

    if (state === 'half-open') {
      try {
        const result = await fn();
        state = 'closed';
        consecutiveFailures = 0;
        openedAt = null;
        return result;
      } catch (err) {
        state = 'open';
        openedAt = Date.now();
        throw err;
      }
    }

    // state === 'closed'
    try {
      const result = await fn();
      consecutiveFailures = 0;
      return result;
    } catch (err) {
      consecutiveFailures += 1;
      if (consecutiveFailures >= failureThreshold) {
        state = 'open';
        openedAt = Date.now();
      }
      throw err;
    }
  };
}