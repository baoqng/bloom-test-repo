// bloom-deps:

export function parseIntegerFromString(value: unknown): number {
  if (value === null || value === undefined) {
    throw new TypeError('value is required');
  }

  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  if (value.trim() === '') {
    throw new TypeError('value cannot be empty');
  }

  if (!/^-?\d+$/.test(value.trim())) {
    throw new TypeError('value must be a valid integer string');
  }

  return parseInt(value.trim(), 10);
}