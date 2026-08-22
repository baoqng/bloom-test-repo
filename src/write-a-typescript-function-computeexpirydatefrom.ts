// bloom-deps:

function computeExpiryDate(from: unknown, duration: unknown): Date {
  // Validate 'from' parameter
  if (from instanceof Date) {
    // from is a Date instance - valid
  } else if (typeof from === 'number') {
    // from is a number - check if finite
    if (!Number.isFinite(from)) {
      throw new TypeError('from must be a Date or finite number');
    }
  } else {
    // from is neither Date nor finite number
    throw new TypeError('from must be a Date or finite number');
  }

  // Validate 'duration' parameter
  if (typeof duration !== 'string' || duration.length === 0) {
    throw new TypeError('duration must be a non-empty string');
  }

  // Parse the duration string into tokens
  const tokens = duration.trim().split(/\s+/);
  let totalMilliseconds = 0;

  for (const token of tokens) {
    // Validate token format: /^\d+[smhdwMy]$/
    if (!/^\d+[smhdwMy]$/.test(token)) {
      throw new SyntaxError(`Invalid duration token: ${token}`);
    }

    // Extract numeric part and unit
    const numericPart = token.slice(0, -1);
    const unit = token[token.length - 1];

    // Parse the numeric value
    const value = parseInt(numericPart, 10);

    // Validate that numeric part is a positive integer (not zero)
    if (!Number.isInteger(value) || value <= 0) {
      throw new RangeError('duration value must be a positive integer');
    }

    // Convert to milliseconds based on unit
    let milliseconds = 0;
    switch (unit) {
      case 's':
        milliseconds = value * 1000;
        break;
      case 'm':
        milliseconds = value * 60 * 1000;
        break;
      case 'h':
        milliseconds = value * 60 * 60 * 1000;
        break;
      case 'd':
        milliseconds = value * 24 * 60 * 60 * 1000;
        break;
      case 'w':
        milliseconds = value * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'M':
        milliseconds = value * 30 * 24 * 60 * 60 * 1000;
        break;
      case 'y':
        milliseconds = value * 365 * 24 * 60 * 60 * 1000;
        break;
    }

    totalMilliseconds += milliseconds;
  }

  // Determine the base date in milliseconds
  let baseTimeMs: number;
  if (from instanceof Date) {
    baseTimeMs = from.getTime();
  } else {
    // from is a finite number (already validated)
    baseTimeMs = from;
  }

  // Compute the expiry date
  const expiryTimeMs = baseTimeMs + totalMilliseconds;
  const result = new Date(expiryTimeMs);

  return result;
}

export { computeExpiryDate };