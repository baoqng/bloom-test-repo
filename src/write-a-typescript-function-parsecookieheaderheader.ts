// bloom-deps:

export function parseCookieHeader(header: unknown): Record<string, string> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    return {};
  }

  const result: Record<string, string> = {};
  const segments = trimmed.split(';');

  let hasValidEntry = false;

  for (const segment of segments) {
    const trimmedSegment = segment.trim();

    if (trimmedSegment.length === 0) {
      continue;
    }

    hasValidEntry = true;

    const equalsIndex = trimmedSegment.indexOf('=');
    if (equalsIndex === -1) {
      throw new SyntaxError('Invalid cookie pair');
    }

    const name = trimmedSegment.slice(0, equalsIndex);
    if (name.length === 0) {
      throw new SyntaxError('Invalid cookie pair');
    }

    const value = trimmedSegment.slice(equalsIndex + 1);
    result[name] = value;
  }

  if (!hasValidEntry) {
    return {};
  }

  return result;
}