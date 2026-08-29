// bloom-deps:

export function computeCircuitBreakerThreshold(
  windowSize: number,
  errorRate: number,
  minRequests: number
): { threshold: number; halfOpenProbeCount: number } {
  // Validate windowSize
  if (typeof windowSize !== 'number' || !Number.isFinite(windowSize)) {
    throw new TypeError('windowSize must be a number');
  }
  if (windowSize < 1 || !Number.isInteger(windowSize)) {
    throw new RangeError('windowSize must be a positive integer');
  }

  // Validate errorRate
  if (typeof errorRate !== 'number' || !Number.isFinite(errorRate)) {
    throw new TypeError('errorRate must be a number');
  }
  if (errorRate <= 0 || errorRate > 1) {
    throw new RangeError('errorRate must be in (0, 1]');
  }

  // Validate minRequests
  if (typeof minRequests !== 'number' || !Number.isFinite(minRequests)) {
    throw new TypeError('minRequests must be a number');
  }
  if (minRequests < 1 || !Number.isInteger(minRequests)) {
    throw new RangeError('minRequests must be a positive integer');
  }
  if (minRequests > windowSize) {
    throw new RangeError('minRequests must be <= windowSize');
  }

  // Compute threshold and halfOpenProbeCount
  const threshold = Math.ceil(windowSize * errorRate);
  const halfOpenProbeCount = Math.max(1, Math.ceil(minRequests / 2));

  return { threshold, halfOpenProbeCount };
}