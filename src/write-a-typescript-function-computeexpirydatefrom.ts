// bloom-deps:

function computeExpiryDate(from: unknown, duration: unknown): Date {
  // Validate 'from'
  let baseMs: number;
  if (from instanceof Date) {
    baseMs = from.getTime();
  } else if (typeof from === 'number' && Number.isFinite(from)) {
    baseMs = from;
  } else {
    throw new TypeError('from must be a Date or finite number');
  }

  // Validate 'duration'
  if (typeof duration !== 'string' || duration.length === 0) {
    throw new TypeError('duration must be a non-empty string');
  }

  const tokens = duration.trim().split(/\s+/);
  if (tokens.length === 0 || (tokens.length === 1 && tokens[0] === '')) {
    throw new TypeError('duration must be a non-empty string');
  }

  const unitToMs: Record<string, number> = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000,
    'w': 7 * 24 * 60 * 60 * 1000,
    'M': 30 * 24 * 60 * 60 * 1000,
    'y': 365 * 24 * 60 * 60 * 1000,
  };

  let totalMs = 0;

  for (const token of tokens) {
    if (!/^\d+[smhdwMy]$/.test(token)) {
      throw new SyntaxError(`Invalid duration token: ${token}`);
    }

    const unit = token[token.length - 1];
    const numStr = token.slice(0, token.length - 1);
    const value = Number(numStr);

    if (!Number.isInteger(value) || value < 1) {
      throw new RangeError('duration value must be a positive integer');
    }

    totalMs += value * unitToMs[unit];
  }

  return new Date(baseMs + totalMs);
}

export { computeExpiryDate };