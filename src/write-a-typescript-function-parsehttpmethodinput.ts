// bloom-deps:

export function parseHttpMethod(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const uppercased = input.toUpperCase();

  const STANDARD_METHODS = new Set([
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH',
    'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'
  ]);

  if (STANDARD_METHODS.has(uppercased)) {
    return uppercased;
  }

  // Validate token-safe characters per RFC 7230
  // Allowed: A-Z, 0-9, '-', '_', '.', '!', '#', '$', '%', '&', "'", '*', '+', '^', '`', '|', '~'
  if (/[^A-Za-z0-9\-_\.!#$%&'*+^`|~]/.test(uppercased)) {
    throw new SyntaxError('Invalid HTTP method');
  }

  return uppercased;
}