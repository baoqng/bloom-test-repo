// bloom-deps:

export function validateCurrencyCode(code: unknown): string {
  if (typeof code !== 'string') {
    throw new TypeError('code must be a string');
  }

  if (code.trim().length === 0) {
    throw new RangeError('code must not be empty');
  }

  const trimmed = code.trim();

  if (trimmed.length !== 3) {
    throw new RangeError('code must be exactly 3 characters');
  }

  if (!/^[a-zA-Z]{3}$/.test(trimmed)) {
    throw new RangeError('code must contain only ASCII letters');
  }

  return trimmed.toUpperCase();
}