// bloom-deps:

export function parseRetryAfterMs(headerValue: unknown): number {
  // Type check: must be a string
  if (typeof headerValue !== 'string') {
    throw new TypeError('headerValue must be a string');
  }

  // Trim the value
  const trimmed = headerValue.trim();

  // Empty or whitespace-only check
  if (trimmed.length === 0) {
    throw new RangeError('headerValue must not be empty');
  }

  // Check if it matches the integer seconds format
  if (/^\d+$/.test(trimmed)) {
    // It's a non-negative integer (seconds)
    const seconds = Number(trimmed);
    return seconds * 1000;
  }

  // Otherwise, try to parse as an HTTP-date
  const date = new Date(trimmed);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new RangeError('headerValue is not a valid integer seconds value or HTTP-date');
  }

  // Get current time
  const now = Date.now();
  const dateTime = date.getTime();

  // If the date is in the past or equal to now, return 0
  if (dateTime <= now) {
    return 0;
  }

  // If the date is in the future, return the ceiling of the difference
  return Math.ceil(dateTime - now);
}