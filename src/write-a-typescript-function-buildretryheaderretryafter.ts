// bloom-deps:

function buildRetryHeader(retryAfter: unknown, unit: unknown): string {
  // Validate retryAfter is a positive integer
  if (
    typeof retryAfter !== 'number' ||
    !Number.isInteger(retryAfter) ||
    retryAfter <= 0
  ) {
    throw new TypeError('retryAfter must be a positive integer');
  }

  // Validate unit is 'seconds' or 'date'
  if (unit !== 'seconds' && unit !== 'date') {
    throw new TypeError("unit must be 'seconds' or 'date'");
  }

  if (unit === 'seconds') {
    // Return numeric value as decimal string
    return retryAfter.toString();
  }

  // unit is 'date'
  // Interpret retryAfter as Unix timestamp in milliseconds
  // Return RFC 7231 HTTP-date string
  const date = new Date(retryAfter);
  return date.toUTCString();
}

export { buildRetryHeader };