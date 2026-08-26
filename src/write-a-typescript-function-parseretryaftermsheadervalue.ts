export function parseRetryAfterMs(headerValue: unknown): number {
  if (typeof headerValue !== "string") {
    throw new TypeError("headerValue must be a string");
  }

  const trimmed = headerValue.trim();

  if (trimmed.length === 0) {
    throw new RangeError("headerValue must not be empty");
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed) * 1000;
  }

  const date = new Date(trimmed);
  if (isNaN(date.getTime())) {
    throw new RangeError("headerValue is not a valid integer seconds value or HTTP-date");
  }

  // Reject numeric-like strings that aren't pure integers (e.g. "1.5")
  // These may parse as valid dates in some engines but should not be accepted.
  if (/^\d/.test(trimmed) && !/^[A-Za-z]/.test(trimmed)) {
    throw new RangeError("headerValue is not a valid integer seconds value or HTTP-date");
  }

  const diff = date.getTime() - Date.now();
  if (diff <= 0) {
    return 0;
  }

  return Math.ceil(diff);
}