// bloom-deps:

function computeExpiryDate(from: unknown, duration: unknown): Date {
  // Validate 'from' parameter
  let baseMs: number;
  if (from instanceof Date) {
    baseMs = from.getTime();
  } else if (typeof from === 'number') {
    if (!Number.isFinite(from)) {
      throw new TypeError('from must be a Date or finite number');
    }
    baseMs = from;
  } else {
    throw new TypeError('from must be a Date or finite number');
  }

  // Validate 'duration' parameter
  if (typeof duration !== 'string' || duration.length === 0) {
    throw new TypeError('duration must be a non-empty string');
  }

  // Parse duration string
  const tokens = duration.trim().split(/\s+/);
  let totalMs = 0;

  for (const token of tokens) {
    // Validate token format
    if (!/^\d+[smhdwMy]$/.test(token)) {
      throw new SyntaxError(`Invalid duration token: ${token}`);
    }

    // Extract numeric part and unit
    const numericPart = parseInt(token.slice(0, -1), 10);
    const unit = token[token.length - 1];

    // Validate numeric part is positive
    if (!Number.isInteger(numericPart) || numericPart <= 0) {
      throw new RangeError('duration value must be a positive integer');
    }

    // Convert to milliseconds based on unit
    let ms = 0;
    switch (unit) {
      case 's':
        ms = numericPart * 1000;
        break;
      case 'm':
        ms = numericPart * 60 * 1000;
        break;
      case 'h':
        ms = numericPart * 60 * 60 * 1000;
        break;
      case 'd':
        ms = numericPart * 24 * 60 * 60 * 1000;
        break;
      case 'w':
        ms = numericPart * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'M':
        ms = numericPart * 30 * 24 * 60 * 60 * 1000;
        break;
      case 'y':
        ms = numericPart * 365 * 24 * 60 * 60 * 1000;
        break;
    }

    totalMs += ms;
  }

  // Compute and return expiry date
  return new Date(baseMs + totalMs);
}

export { computeExpiryDate };