// bloom-deps:

function validateSessionToken(token: unknown): { prefix: string; payload: string; signature: string } {
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  if (!token.trim()) {
    throw new RangeError('token must not be empty');
  }

  const trimmed = token.trim();

  // Count dot occurrences explicitly using indexOf
  let dotCount = 0;
  let searchPos = 0;
  while (true) {
    const idx = trimmed.indexOf('.', searchPos);
    if (idx === -1) break;
    dotCount++;
    searchPos = idx + 1;
  }

  if (dotCount !== 2) {
    throw new RangeError('token must have exactly three dot-separated segments');
  }

  // Extract exactly three segments using indexOf+slice
  const firstDot = trimmed.indexOf('.');
  const segment1 = trimmed.slice(0, firstDot);
  const rest = trimmed.slice(firstDot + 1);
  const secondDot = rest.indexOf('.');
  const segment2 = rest.slice(0, secondDot);
  const segment3 = rest.slice(secondDot + 1);

  if (!segment1 || !segment2 || !segment3) {
    throw new RangeError('token must have exactly three dot-separated segments');
  }

  const base64urlPattern = /^[A-Za-z0-9\-_]+$/;

  if (!base64urlPattern.test(segment1)) {
    throw new RangeError('token segment 1 contains invalid characters');
  }

  if (!base64urlPattern.test(segment2)) {
    throw new RangeError('token segment 2 contains invalid characters');
  }

  if (!base64urlPattern.test(segment3)) {
    throw new RangeError('token segment 3 contains invalid characters');
  }

  return { prefix: segment1, payload: segment2, signature: segment3 };
}

export { validateSessionToken };