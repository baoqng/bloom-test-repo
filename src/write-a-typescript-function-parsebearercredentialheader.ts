// bloom-deps:

export function parseBearerCredential(header: unknown): string {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    throw new RangeError('header must not be empty');
  }

  const prefix = 'Bearer ';
  if (!header.trimStart().startsWith(prefix)) {
    throw new RangeError('header must use Bearer scheme');
  }

  const idx = header.indexOf(prefix);
  const afterPrefix = header.slice(idx + prefix.length);
  const token = afterPrefix.trim();

  if (token.length === 0) {
    throw new RangeError('token must not be empty');
  }

  if (/\s/.test(token)) {
    throw new RangeError('token must not contain whitespace');
  }

  return token;
}