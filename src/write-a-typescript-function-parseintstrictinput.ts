// bloom-deps:
function parseIntStrict(input: unknown, min: number, max: number): number {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const parsed = parseInt(input, 10);

  if (isNaN(parsed) || !isFinite(parsed) || parsed !== Math.floor(parsed)) {
    throw new RangeError('Value out of range');
  }

  if (parsed < min || parsed > max) {
    throw new RangeError('Value out of range');
  }

  return parsed;
}

export { parseIntStrict };