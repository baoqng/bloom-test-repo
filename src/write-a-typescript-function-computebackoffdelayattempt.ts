// bloom-deps:

function computeBackoffDelay(attempt: unknown, baseMs: unknown, maxMs: unknown): number {
  // Validate attempt
  if (
    typeof attempt !== 'number' ||
    !Number.isInteger(attempt) ||
    attempt < 0
  ) {
    throw new TypeError('attempt must be a non-negative integer');
  }

  // Validate baseMs
  if (
    typeof baseMs !== 'number' ||
    !Number.isInteger(baseMs) ||
    baseMs <= 0
  ) {
    throw new TypeError('baseMs must be a positive integer');
  }

  // Validate maxMs
  if (
    typeof maxMs !== 'number' ||
    !Number.isInteger(maxMs) ||
    maxMs <= 0
  ) {
    throw new TypeError('maxMs must be a positive integer');
  }

  // Validate maxMs >= baseMs
  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be greater than or equal to baseMs');
  }

  // Compute exponential backoff with full jitter
  // Cap = min(baseMs * 2^attempt, maxMs)
  const cap = Math.min(baseMs * Math.pow(2, attempt), maxMs);

  // Return random value in [0, cap]
  return Math.random() * cap;
}

export { computeBackoffDelay };