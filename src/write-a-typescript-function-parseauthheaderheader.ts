// bloom-deps:

export function parseAuthHeader(header: unknown): { scheme: string; credentials: string } {
  if (typeof header !== 'string' || header.length === 0) {
    throw new SyntaxError('Invalid Authorization header');
  }

  const spaceIndex = header.indexOf(' ');
  if (spaceIndex === -1) {
    throw new SyntaxError('Invalid Authorization header');
  }

  const scheme = header.slice(0, spaceIndex);
  const credentials = header.slice(spaceIndex + 1);

  if (credentials.length === 0) {
    throw new RangeError('Credentials must not be empty');
  }

  return { scheme, credentials };
}