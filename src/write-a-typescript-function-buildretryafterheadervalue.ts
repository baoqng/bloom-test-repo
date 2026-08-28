// bloom-deps:

export function buildRetryAfterHeader(value: unknown): string {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError('delay must be finite');
    }
    if (value < 0) {
      throw new RangeError('delay must be non-negative');
    }
    return String(Math.round(value));
  }

  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new RangeError('date must be valid');
    }
    return value.toUTCString();
  }

  throw new TypeError('value must be a number or Date');
}