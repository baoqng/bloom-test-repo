// bloom-deps:

export function parseKeyEqualsValue(input: unknown): { key: string; value: string } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new RangeError('input must not be empty');
  }

  const eqIndex = trimmed.indexOf('=');

  if (eqIndex === -1) {
    throw new RangeError('input must contain an = separator');
  }

  const rawKey = trimmed.slice(0, eqIndex).trim();
  const rawValue = trimmed.slice(eqIndex + 1).trim();

  if (rawKey.length === 0) {
    throw new RangeError('key must not be empty');
  }

  if (!/^[A-Za-z0-9\-_]+$/.test(rawKey)) {
    throw new RangeError('key contains invalid characters');
  }

  return { key: rawKey, value: rawValue };
}