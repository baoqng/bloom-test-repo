// bloom-deps:

export function buildAuthHeader(scheme: unknown, token: unknown): string {
  if (typeof scheme !== 'string' || scheme.length === 0) {
    throw new TypeError('scheme must be a non-empty string');
  }
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('token must be a non-empty string');
  }
  if (scheme !== 'Bearer' && scheme !== 'Basic' && scheme !== 'ApiKey') {
    throw new TypeError('Unsupported auth scheme');
  }
  return `${scheme} ${token}`;
}