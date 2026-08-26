// bloom-deps:

function buildBackoffSchedule(attempts: unknown, baseMs: unknown, capMs: unknown): number[] {
  // Type validation
  if (typeof attempts !== 'number') {
    throw new TypeError('attempts must be a number');
  }
  if (typeof baseMs !== 'number') {
    throw new TypeError('baseMs must be a number');
  }
  if (typeof capMs !== 'number') {
    throw new TypeError('capMs must be a number');
  }

  // Range validation for attempts
  if (!Number.isInteger(attempts) || attempts <= 0) {
    throw new RangeError('attempts must be a positive integer');
  }

  // Range validation for baseMs
  if (!Number.isFinite(baseMs) || baseMs <= 0) {
    throw new RangeError('baseMs must be a positive finite number');
  }

  // Range validation for capMs
  if (!Number.isFinite(capMs) || capMs < baseMs) {
    throw new RangeError('capMs must be a positive finite number greater than or equal to baseMs');
  }

  // Build the backoff schedule
  const schedule: number[] = [];
  for (let i = 0; i < attempts; i++) {
    const delay = Math.min(baseMs * Math.pow(2, i), capMs);
    schedule.push(delay);
  }

  return schedule;
}

export { buildBackoffSchedule };