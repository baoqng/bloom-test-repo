// bloom-deps:

export function computeLeakyBucket(
  currentLevel: unknown,
  capacity: unknown,
  leakRatePerMs: unknown,
  elapsedMs: unknown
): { newLevel: number; allowed: boolean; remainingCapacity: number } {
  if (typeof currentLevel !== 'number') {
    throw new TypeError('currentLevel must be a number');
  }
  if (typeof capacity !== 'number') {
    throw new TypeError('capacity must be a number');
  }
  if (typeof leakRatePerMs !== 'number') {
    throw new TypeError('leakRatePerMs must be a number');
  }
  if (typeof elapsedMs !== 'number') {
    throw new TypeError('elapsedMs must be a number');
  }

  if (!isFinite(currentLevel)) {
    throw new TypeError('currentLevel must be finite');
  }
  if (!isFinite(capacity)) {
    throw new TypeError('capacity must be finite');
  }
  if (!isFinite(leakRatePerMs)) {
    throw new TypeError('leakRatePerMs must be finite');
  }
  if (!isFinite(elapsedMs)) {
    throw new TypeError('elapsedMs must be finite');
  }

  if (currentLevel < 0) {
    throw new RangeError('currentLevel must be non-negative');
  }
  if (capacity <= 0) {
    throw new RangeError('capacity must be positive');
  }
  if (leakRatePerMs <= 0) {
    throw new RangeError('leakRatePerMs must be positive');
  }
  if (elapsedMs < 0) {
    throw new RangeError('elapsedMs must be non-negative');
  }

  const leaked = leakRatePerMs * elapsedMs;
  const levelAfterLeak = Math.max(0, currentLevel - leaked);

  const allowed = (levelAfterLeak + 1) <= capacity;
  const newLevel = allowed ? levelAfterLeak + 1 : levelAfterLeak;
  const remainingCapacity = Math.max(0, capacity - newLevel);

  return { newLevel, allowed, remainingCapacity };
}