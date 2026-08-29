// bloom-deps:

export function computeJitterDelay(
  baseMs: number,
  jitterFactor: number,
  maxMs: number,
  rand?: number
): number {
  if (typeof baseMs !== 'number' || !Number.isFinite(baseMs)) {
    throw new TypeError('baseMs must be a finite number');
  }
  if (typeof jitterFactor !== 'number' || !Number.isFinite(jitterFactor)) {
    throw new TypeError('jitterFactor must be a finite number');
  }
  if (typeof maxMs !== 'number' || !Number.isFinite(maxMs)) {
    throw new TypeError('maxMs must be a finite number');
  }
  if (baseMs < 0) {
    throw new RangeError('baseMs must be >= 0');
  }
  if (jitterFactor < 0) {
    throw new RangeError('jitterFactor must be >= 0');
  }
  if (maxMs < baseMs) {
    throw new RangeError('maxMs must be >= baseMs');
  }
  if (rand !== undefined) {
    if (rand < 0 || rand >= 1) {
      throw new RangeError('rand must be in [0, 1)');
    }
  } else {
    rand = Math.random();
  }

  const computed = baseMs * (1 + jitterFactor * rand);

  if (computed < baseMs) {
    return baseMs;
  }
  if (computed > maxMs) {
    return maxMs;
  }
  return computed;
}