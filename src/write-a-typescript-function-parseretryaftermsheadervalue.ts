// bloom-deps:

export function parseRetryAfterMs(headerValue: unknown): number {
  if (typeof headerValue !== 'string') {
    throw new TypeError('headerValue must be a string');
  }

  const trimmed = headerValue.trim();

  if (trimmed.length === 0) {
    throw new RangeError('headerValue must not be empty');
  }

  if (/^\d+$/.test(trimmed)) {
    const seconds = Number(trimmed);
    return seconds * 1000;
  }

  const date = new Date(headerValue);
  if (isNaN(date.getTime())) {
    throw new RangeError('headerValue is not a valid integer seconds value or HTTP-date');
  }

  const diff = date.getTime() - Date.now();
  if (diff <= 0) {
    return 0;
  }

  return Math.ceil(diff);
}