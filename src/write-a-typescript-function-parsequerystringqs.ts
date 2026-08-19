// bloom-deps:

export function parseQueryString(qs: string): Record<string, string> {
  if (typeof qs !== 'string') {
    throw new TypeError('qs must be a string');
  }

  const trimmed = qs.trim();

  if (trimmed === '' || trimmed === '?') {
    return {};
  }

  const stripped = trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;

  if (stripped.trim() === '') {
    return {};
  }

  const result: Record<string, string> = {};

  const pairs = stripped.split('&');

  for (const pair of pairs) {
    if (pair === '') {
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

    if (decodedKey === '') {
      continue;
    }

    result[decodedKey] = decodedValue;
  }

  return result;
}