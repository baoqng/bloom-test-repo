// bloom-deps:

interface CircuitBreakerState {
  status: 'open' | 'closed' | 'half-open';
  failureCount: number;
  nextAttemptAt: number | null;
}

function isPositiveInteger(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0
  );
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0
  );
}

export function buildCircuitBreakerState(
  failures: unknown,
  threshold: unknown,
  resetMs: unknown
): CircuitBreakerState {
  if (!isNonNegativeInteger(failures)) {
    throw new TypeError('failures must be a non-negative integer');
  }

  if (!isPositiveInteger(threshold)) {
    throw new TypeError('threshold must be a positive integer');
  }

  if (!isPositiveInteger(resetMs)) {
    throw new TypeError('resetMs must be a positive integer');
  }

  if (failures >= threshold) {
    return {
      status: 'open',
      failureCount: failures,
      nextAttemptAt: Date.now() + resetMs,
    };
  }

  if (failures === 0) {
    return {
      status: 'closed',
      failureCount: 0,
      nextAttemptAt: null,
    };
  }

  // failures is between 1 and threshold - 1 inclusive
  return {
    status: 'half-open',
    failureCount: failures,
    nextAttemptAt: null,
  };
}