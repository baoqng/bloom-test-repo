// bloom-deps:

function parseIntPart(s: string): number {
  const trimmed = s.trim();
  if (!/^-?\d+$/.test(trimmed)) {
    return NaN;
  }
  return parseInt(trimmed, 10);
}

export function parseIntRange(input: unknown): { min: number; max: number } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new RangeError('input must not be empty');
  }

  const separator = '..';

  // Count occurrences of '..' in the string
  let count = 0;
  let searchStart = 0;
  while (true) {
    const idx = trimmed.indexOf(separator, searchStart);
    if (idx === -1) break;
    count++;
    searchStart = idx + separator.length;
  }

  if (count !== 1) {
    throw new RangeError('input must be in MIN..MAX format');
  }

  // Split on first '..' only
  const sepIdx = trimmed.indexOf(separator);
  const minPart = trimmed.slice(0, sepIdx);
  const maxPart = trimmed.slice(sepIdx + separator.length);

  if (minPart.length === 0 || maxPart.length === 0) {
    throw new RangeError('input must be in MIN..MAX format');
  }

  const min = parseIntPart(minPart);
  if (isNaN(min)) {
    throw new RangeError('min must be a valid integer');
  }

  const max = parseIntPart(maxPart);
  if (isNaN(max)) {
    throw new RangeError('max must be a valid integer');
  }

  if (min > max) {
    throw new RangeError('min must not exceed max');
  }

  return { min, max };
}