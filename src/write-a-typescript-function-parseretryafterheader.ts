// bloom-deps:

export function parseRetryAfter(header: unknown): number {
  if (typeof header !== 'string' || header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }

  const trimmed = header.trim();

  // Check if it looks like an integer string (optional sign + digits)
  if (/^-?\d+$/.test(trimmed)) {
    const value = parseInt(trimmed, 10);
    if (value < 0) {
      throw new RangeError('Retry-After integer value must be non-negative');
    }
    return value * 1000;
  }

  // Try to parse as HTTP-date
  const parsed = Date.parse(header);
  if (isNaN(parsed)) {
    throw new RangeError('header is neither a valid non-negative integer nor a parseable date');
  }

  return Math.max(0, new Date(header).getTime() - Date.now());
}