// bloom-deps:

function parseCommaSeparatedIds(input: unknown): number[] {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const trimmed = input.trim();
  const segments = trimmed.split(',');

  const result: number[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    if (!/^\d+$/.test(segment)) {
      throw new Error(`invalid id at position ${i + 1}: "${segment}"`);
    }
    const value = parseInt(segment, 10);
    if (value <= 0) {
      throw new Error(`invalid id at position ${i + 1}: "${segment}"`);
    }
    result.push(value);
  }

  return result;
}

export { parseCommaSeparatedIds };