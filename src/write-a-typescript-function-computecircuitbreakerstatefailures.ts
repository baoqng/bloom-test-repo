// bloom-deps:

function computeCircuitBreakerState(
  failures: unknown,
  threshold: unknown,
  halfOpenAfterMs: unknown,
  lastFailureAt: unknown
): 'open' | 'closed' | 'half-open' {
  if (
    typeof failures !== 'number' ||
    typeof threshold !== 'number' ||
    typeof halfOpenAfterMs !== 'number' ||
    typeof lastFailureAt !== 'number'
  ) {
    throw new TypeError('All arguments must be numbers');
  }

  if (!Number.isFinite(failures)) {
    throw new TypeError('failures must be a finite number');
  }
  if (!Number.isFinite(threshold)) {
    throw new TypeError('threshold must be a finite number');
  }
  if (!Number.isFinite(halfOpenAfterMs)) {
    throw new TypeError('halfOpenAfterMs must be a finite number');
  }
  if (!Number.isFinite(lastFailureAt)) {
    throw new TypeError('lastFailureAt must be a finite number');
  }

  if (failures < 0) {
    throw new RangeError('failures must not be negative');
  }

  if (!Number.isFinite(threshold) || threshold <= 0 || !Number.isInteger(threshold)) {
    throw new RangeError('threshold must be a positive integer');
  }

  if (!Number.isFinite(halfOpenAfterMs) || halfOpenAfterMs <= 0) {
    throw new RangeError('halfOpenAfterMs must be a positive number');
  }

  if (failures < threshold) {
    return 'closed';
  }

  const elapsed = Date.now() - lastFailureAt;
  if (elapsed >= halfOpenAfterMs) {
    return 'half-open';
  }

  return 'open';
}

export { computeCircuitBreakerState };