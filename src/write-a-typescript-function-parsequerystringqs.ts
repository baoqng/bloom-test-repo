// bloom-deps:

export function parseQueryString(qs: string): Record<string, string> {
  if (typeof qs !== 'string') {
    throw new TypeError('qs must be a string');
  }

  const trimmed = qs.trim();
  if (trimmed === '') {
    return {};
  }

  let queryString = trimmed;
  if (queryString.startsWith('?')) {
    queryString = queryString.slice(1);
  }

  if (queryString === '') {
    return {};
  }

  const result: Record<string, string> = {};
  const pairs = queryString.split('&');

  for (const pair of pairs) {
    if (pair === '') {
      continue;
    }

    const eqIndex = pair.indexOf('=');
    let key: string;
    let value: string;

    if (eqIndex === -1) {
      key = pair;
      value = '';
    } else {
      key = pair.substring(0, eqIndex);
      value = pair.substring(eqIndex + 1);
    }

    if (key === '') {
      continue;
    }

    try {
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);
      result[decodedKey] = decodedValue;
    } catch {
      continue;
    }
  }

  return result;
}