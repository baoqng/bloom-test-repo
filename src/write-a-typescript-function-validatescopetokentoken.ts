// bloom-deps:

export function validateScopeToken(token: unknown): string {
  if (typeof token !== 'string') {
    throw new TypeError('scope token must be a string');
  }

  if (token.length === 0) {
    throw new TypeError('scope token must not be empty');
  }

  if (!/^[a-zA-Z0-9._:]+$/.test(token)) {
    throw new TypeError('scope token must contain only alphanumeric characters, dots, colons, and underscores');
  }

  if (token[0] === '.' || token[0] === ':') {
    throw new TypeError('scope token must not start with a dot or colon');
  }

  if (token[token.length - 1] === '.' || token[token.length - 1] === ':') {
    throw new TypeError('scope token must not end with a dot or colon');
  }

  return token;
}