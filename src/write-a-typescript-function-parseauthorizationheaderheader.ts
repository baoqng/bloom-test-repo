// bloom-deps:

export function parseAuthorizationHeader(header: unknown): { scheme: string; credentials: string } {
  if (typeof header !== 'string' || header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }

  const spaceIndex = header.indexOf(' ');
  if (spaceIndex === -1) {
    throw new RangeError('header must contain a space character');
  }

  const scheme = header.slice(0, spaceIndex);
  const credentialsRaw = header.slice(spaceIndex + 1);
  const credentials = credentialsRaw.trim();

  if (scheme.length === 0) {
    throw new RangeError('scheme must not be empty');
  }

  if (credentials.length === 0) {
    throw new RangeError('credentials must not be empty');
  }

  return { scheme, credentials };
}