// bloom-deps:

export function validateApiKeyFormat(
  key: unknown,
  expectedPrefix: unknown
): { prefix: string; body: string } {
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }

  if (typeof expectedPrefix !== 'string' || expectedPrefix.trim() === '') {
    throw new TypeError('expectedPrefix must be a non-empty string');
  }

  if (key.trim() === '') {
    throw new RangeError('key must not be empty');
  }

  const trimmedKey = key.trim();
  const trimmedPrefix = expectedPrefix.trim();

  const prefixWithUnderscore = trimmedPrefix + '_';

  if (!trimmedKey.startsWith(prefixWithUnderscore)) {
    throw new RangeError(`key must start with '${trimmedPrefix}_'`);
  }

  const body = trimmedKey.slice(prefixWithUnderscore.length);

  if (body === '') {
    throw new RangeError('key body must not be empty');
  }

  if (body.length < 16) {
    throw new RangeError('key body must be between 16 and 256 characters');
  }

  if (body.length > 256) {
    throw new RangeError('key body must be between 16 and 256 characters');
  }

  if (!/^[A-Za-z0-9\-_]+$/.test(body)) {
    throw new RangeError('key body must contain only base64url characters');
  }

  return { prefix: trimmedPrefix, body };
}