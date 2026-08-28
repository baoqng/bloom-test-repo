// bloom-deps:

export function extractBearerToken(header: unknown): string {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const prefix = 'Bearer ';

  if (!header.startsWith(prefix)) {
    throw new RangeError('header must start with exactly "Bearer "');
  }

  const tokenPortion = header.slice(prefix.length);
  const trimmed = tokenPortion.trim();

  if (trimmed.length === 0) {
    throw new RangeError('token portion must not be empty');
  }

  return trimmed;
}