// bloom-deps:

export function validateApiKey(key: unknown): string {
  if (typeof key !== 'string' || key.length === 0) {
    throw new TypeError('API key must be a non-empty string');
  }

  if (key.length < 32) {
    throw new RangeError('API key too short');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
    throw new TypeError('API key contains invalid characters');
  }

  return key;
}