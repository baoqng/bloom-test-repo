// bloom-deps:

function parseCookieHeader(header: unknown): Map<string, string> {
  if (typeof header !== 'string') {
    throw new TypeError('Cookie header must be a string');
  }

  const result = new Map<string, string>();

  if (header === '') {
    return result;
  }

  const pairs = header.split('; ');

  for (const pair of pairs) {
    const equalsIndex = pair.indexOf('=');

    if (equalsIndex === -1) {
      continue;
    }

    const name = pair.slice(0, equalsIndex).trim();
    const value = pair.slice(equalsIndex + 1).trim();

    if (name === '') {
      continue;
    }

    result.set(name, value);
  }

  return result;
}

export { parseCookieHeader };