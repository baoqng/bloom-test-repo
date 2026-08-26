// bloom-deps:

function parseWwwAuthenticate(header: unknown): { scheme: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim() === '') {
    throw new RangeError('header must not be empty');
  }

  const trimmed = header.trim();
  const whitespaceIndex = trimmed.search(/\s/);

  let scheme: string;
  let remainder: string;

  if (whitespaceIndex === -1) {
    scheme = trimmed.toUpperCase();
    remainder = '';
  } else {
    scheme = trimmed.slice(0, whitespaceIndex).toUpperCase();
    remainder = trimmed.slice(whitespaceIndex).trimStart();
  }

  if (scheme === '') {
    throw new RangeError('scheme must not be empty');
  }

  const params: Record<string, string> = {};

  if (remainder === '') {
    return { scheme, params };
  }

  const tokens = remainder.split(',');

  for (const token of tokens) {
    const trimmedToken = token.trim();

    if (trimmedToken === '') {
      continue;
    }

    const eqIndex = trimmedToken.indexOf('=');

    if (eqIndex === -1) {
      throw new RangeError(`invalid auth parameter: ${trimmedToken}`);
    }

    const key = trimmedToken.slice(0, eqIndex).toLowerCase();
    let value = trimmedToken.slice(eqIndex + 1);

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    params[key] = value;
  }

  return { scheme, params };
}

export { parseWwwAuthenticate };