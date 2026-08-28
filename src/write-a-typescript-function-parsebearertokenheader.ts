// bloom-deps:

export function parseBearerToken(header: unknown): string {
  if (typeof header !== 'string' || header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }

  const prefix = 'Bearer ';
  if (!header.startsWith(prefix)) {
    throw new SyntaxError('Authorization header must use Bearer scheme');
  }

  const token = header.slice(prefix.length);

  if (token.trim().length === 0) {
    throw new RangeError('Bearer token must not be empty');
  }

  return token.trim();
}