// bloom-deps:

export function parseFloatFromString(value: unknown): number {
  if (value === null || value === undefined) {
    throw new TypeError('value is required');
  }
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }
  if (value.trim() === '') {
    throw new TypeError('value cannot be empty');
  }
  if (isNaN(Number(value.trim()))) {
    throw new TypeError('value must be a valid numeric string');
  }
  return parseFloat(value.trim());
}