// bloom-deps:

function computeExpiryDate(from: unknown, duration: unknown): Date {
  // Validate `from`
  let baseMs: number;
  if (from instanceof Date) {
    baseMs = from.getTime();
  } else if (typeof from === 'number' && Number.isFinite(from)) {
    baseMs = from;
  } else {
    throw new TypeError('from must be a Date or finite number');
  }

  // Validate `duration`
  if (typeof duration !== 'string' || duration.length === 0) {
    throw new TypeError('duration must be a non-empty string');
  }

  const tokens = duration.trim().split(/\s+/);
  const tokenRegex = /^\d+[smhdwMy]$/;

  let totalMs = 0;

  for (const token of tokens) {
    if (!tokenRegex.test(token)) {
      throw new SyntaxError(`Invalid duration token: ${token}`);
    }

    const unit = token[token.length - 1];
    const numStr = token.slice(0, token.length - 1);
    const num = Number(numStr);

    if (!Number.isInteger(num) || num < 1) {
      throw new RangeError('duration value must be a positive integer');
    }

    let msPerUnit: number;
    switch (unit) {
      case 's':
        msPerUnit = 1000;
        break;
      case 'm':
        msPerUnit = 60 * 1000;
        break;
      case 'h':
        msPerUnit = 60 * 60 * 1000;
        break;
      case 'd':
        msPerUnit = 24 * 60 * 60 * 1000;
        break;
      case 'w':
        msPerUnit = 7 * 24 * 60 * 60 * 1000;
        break;
      case 'M':
        msPerUnit = 30 * 24 * 60 * 60 * 1000;
        break;
      case 'y':
        msPerUnit = 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        throw new SyntaxError(`Invalid duration token: ${token}`);
    }

    totalMs += num * msPerUnit;
  }

  return new Date(baseMs + totalMs);
}

export { computeExpiryDate };