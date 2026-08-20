// bloom-deps:

function parseQueryString(query: string): Record<string, string> {
  if (typeof query !== 'string') {
    throw new TypeError('query must be a string');
  }

  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return {};
  }

  const normalized = trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;

  if (normalized.length === 0) {
    return {};
  }

  const result: Record<string, string> = {};
  const pairs = normalized.split('&');

  for (const pair of pairs) {
    if (pair.length === 0) {
      continue;
    }

    const eqIndex = pair.indexOf('=');
    let rawKey: string;
    let rawValue: string;

    if (eqIndex === -1) {
      rawKey = pair;
      rawValue = '';
    } else {
      rawKey = pair.slice(0, eqIndex);
      rawValue = pair.slice(eqIndex + 1);
    }

    if (rawKey.length === 0) {
      continue;
    }

    let decodedKey: string;
    let decodedValue: string;

    try {
      decodedKey = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    } catch {
      decodedKey = rawKey;
    }

    try {
      decodedValue = decodeURIComponent(rawValue.replace(/\+/g, ' '));
    } catch {
      decodedValue = rawValue;
    }

    result[decodedKey] = decodedValue;
  }

  return result;
}

export { parseQueryString };