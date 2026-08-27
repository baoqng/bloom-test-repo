// bloom-deps:

function computeRetryBudget(deadlineMs: unknown, elapsedMs: unknown, perAttemptMs: unknown): number {
  if (typeof deadlineMs !== 'number') {
    throw new TypeError('deadlineMs must be a number');
  }
  if (typeof elapsedMs !== 'number') {
    throw new TypeError('elapsedMs must be a number');
  }
  if (typeof perAttemptMs !== 'number') {
    throw new TypeError('perAttemptMs must be a number');
  }

  if (!Number.isFinite(deadlineMs) || deadlineMs <= 0) {
    throw new RangeError('deadlineMs must be a positive finite number');
  }
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    throw new RangeError('elapsedMs must be a non-negative finite number');
  }
  if (!Number.isFinite(perAttemptMs) || perAttemptMs <= 0) {
    throw new RangeError('perAttemptMs must be a positive finite number');
  }

  if (elapsedMs > deadlineMs) {
    throw new RangeError('elapsedMs must not exceed deadlineMs');
  }

  const remaining = deadlineMs - elapsedMs;

  if (remaining === 0) {
    return 0;
  }

  return Math.floor(remaining / perAttemptMs);
}

export { computeRetryBudget };