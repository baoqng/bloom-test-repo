// bloom-deps:

export function parseCommaSeparatedIds(input: unknown): number[] {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new TypeError('input must be a non-empty string');
  }

  const segments = input.split(',').map(seg => seg.trim());

  const result: number[] = [];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
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