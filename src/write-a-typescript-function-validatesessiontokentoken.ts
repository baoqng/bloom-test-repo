// bloom-deps:

function validateSessionToken(token: unknown): { prefix: string; payload: string; signature: string } {
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  if (token.trim().length === 0) {
    throw new RangeError('token must not be empty');
  }

  const trimmed = token.trim();
  const segments = trimmed.split('.');

  if (segments.length !== 3 || segments.some(s => s.length === 0)) {
    throw new RangeError('token must have exactly three dot-separated segments');
  }

  const base64urlRegex = /^[A-Za-z0-9\-_]+$/;

  if (!base64urlRegex.test(segments[0])) {
    throw new RangeError('token segment 1 contains invalid characters');
  }

  if (!base64urlRegex.test(segments[1])) {
    throw new RangeError('token segment 2 contains invalid characters');
  }

  if (!base64urlRegex.test(segments[2])) {
    throw new RangeError('token segment 3 contains invalid characters');
  }

  return {
    prefix: segments[0],
    payload: segments[1],
    signature: segments[2],
  };
}

export { validateSessionToken };