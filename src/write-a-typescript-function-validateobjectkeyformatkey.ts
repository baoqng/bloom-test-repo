// bloom-deps:

export function validateObjectKeyFormat(key: unknown): string {
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }

  if (key.length === 0) {
    throw new RangeError('key must not be empty');
  }

  if (key.length > 255) {
    throw new RangeError('key must not exceed 255 characters');
  }

  if (key.includes('\x00')) {
    throw new RangeError('key must not contain null bytes');
  }

  if (key.trim().length === 0) {
    throw new RangeError('key must not be all whitespace');
  }

  return key;
}