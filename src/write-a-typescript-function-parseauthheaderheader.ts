// bloom-deps:

function parseAuthHeader(header: unknown): { scheme: string; credentials: string } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const spaceIndex = header.indexOf(' ');
  if (spaceIndex === -1) {
    throw new SyntaxError('Malformed Authorization header');
  }

  const scheme = header.slice(0, spaceIndex).toLowerCase();
  const credentials = header.slice(spaceIndex + 1).trim();

  if (credentials.length === 0) {
    throw new SyntaxError('credentials must not be empty');
  }

  return { scheme, credentials };
}

export { parseAuthHeader };