// bloom-deps:

export function parseStrictDecimal(value: unknown): number {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new SyntaxError('Input must not be empty');
  }

  if (trimmed.includes('e') || trimmed.includes('E')) {
    throw new SyntaxError('Scientific notation is not allowed');
  }

  const parsed = parseFloat(trimmed);

  if (isNaN(parsed)) {
    throw new SyntaxError('Not a valid number');
  }

  if (!isFinite(parsed)) {
    throw new RangeError('Value must be finite');
  }

  return parsed;
}