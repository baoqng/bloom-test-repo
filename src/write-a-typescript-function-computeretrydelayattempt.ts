// bloom-deps:

function computeRetryDelay(attempt: unknown, baseMs: unknown, maxMs: unknown): number {
  // Validate attempt: must be a positive finite integer
  if (
    !Number.isInteger(attempt) ||
    typeof attempt !== 'number' ||
    attempt < 1 ||
    !isFinite(attempt)
  ) {
    throw new TypeError(
      'attempt must be a positive finite integer (attempt >= 1)'
    );
  }

  // Validate baseMs: must be a positive finite number
  if (
    typeof baseMs !== 'number' ||
    baseMs <= 0 ||
    !isFinite(baseMs)
  ) {
    throw new TypeError('baseMs must be a positive finite number (baseMs > 0)');
  }

  // Validate maxMs: must be a positive finite number
  if (
    typeof maxMs !== 'number' ||
    maxMs <= 0 ||
    !isFinite(maxMs)
  ) {
    throw new TypeError('maxMs must be a positive finite number (maxMs > 0)');
  }

  // Check that maxMs >= baseMs
  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be >= baseMs');
  }

  // Compute the cap: min(maxMs, baseMs * 2^(attempt - 1))
  const exponentialCap = baseMs * Math.pow(2, attempt - 1);
  const cap = Math.min(maxMs, exponentialCap);

  // Return a uniformly distributed random value in [0, cap)
  return Math.random() * cap;
}

export { computeRetryDelay };