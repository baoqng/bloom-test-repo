// bloom-deps:

export function parseAuthHeader(header: unknown): { scheme: string; credentials: string } {
  if (typeof header !== 'string' || header.length === 0) {
    throw new TypeError('Invalid Authorization header format');
  }

  const firstSpace = header.indexOf(' ');
  if (firstSpace === -1) {
    throw new TypeError('Invalid Authorization header format');
  }

  const lastSpace = header.lastIndexOf(' ');
  if (firstSpace !== lastSpace) {
    throw new TypeError('Invalid Authorization header format');
  }

  const scheme = header.slice(0, firstSpace);
  const credentials = header.slice(firstSpace + 1);

  if (scheme.length === 0 || credentials.length === 0) {
    throw new TypeError('Invalid Authorization header format');
  }

  return { scheme, credentials };
}