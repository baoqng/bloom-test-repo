// bloom-deps:

function parseRetryAfter(header: unknown): number {
  // [REQUIRED] typeof check for string input
  if (typeof header !== 'string') {
    throw new TypeError('Retry-After header must be a string');
  }

  // [REQUIRED] Check maxLength and format for string inputs
  if (header.length === 0) {
    throw new TypeError('Retry-After header must be a non-empty string');
  }

  // Try to parse as non-negative integer (seconds)
  const intValue = parseInt(header, 10);
  
  // Check if it's a valid integer string (no leading spaces, valid format)
  if (header === intValue.toString()) {
    // It's a valid integer string
    if (intValue < 0) {
      throw new RangeError('Retry-After integer value must be non-negative');
    }
    return intValue * 1000;
  }

  // Try to parse as HTTP-date
  const dateTime = new Date(header).getTime();
  
  if (isNaN(dateTime)) {
    // Neither a valid non-negative integer nor a parseable date
    throw new RangeError('Retry-After header must be a valid non-negative integer or HTTP-date string');
  }

  // Valid HTTP-date: return milliseconds to wait, clamped to 0 for past dates
  return Math.max(0, dateTime - Date.now());
}

export { parseRetryAfter };