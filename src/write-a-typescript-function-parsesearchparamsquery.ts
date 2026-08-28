// bloom-deps:

function parseSearchParams(query: unknown): Record<string, string> {
  if (typeof query !== 'string') {
    throw new TypeError('query must be a string');
  }

  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return {};
  }

  let normalized = trimmed;
  if (normalized.startsWith('?')) {
    normalized = normalized.slice(1);
  }

  const result: Record<string, string> = {};
  const tokens = normalized.split('&');

  for (const token of tokens) {
    if (token.length === 0) {
      continue;
    }

    const eqIndex = token.indexOf('=');

    let rawKey: string;
    let rawValue: string;

    if (eqIndex === -1) {
      rawKey = token;
      rawValue = '';
    } else {
      rawKey = token.slice(0, eqIndex);
      rawValue = token.slice(eqIndex + 1);
    }

    let decodedKey: string;
    let decodedValue: string;

    try {
      decodedKey = decodeURIComponent(rawKey);
    } catch {
      throw new RangeError('query contains an invalid percent-encoding');
    }

    try {
      decodedValue = decodeURIComponent(rawValue);
    } catch {
      throw new RangeError('query contains an invalid percent-encoding');
    }

    if (decodedKey.length === 0) {
      continue;
    }

    result[decodedKey] = decodedValue;
  }

  return result;
}

export { parseSearchParams };