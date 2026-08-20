// bloom-deps:

function parseQueryString(input: unknown): Record<string, string | string[]> {
  if (typeof input !== 'string') {
    throw new TypeError('Expected string');
  }

  let str = input;

  if (str.startsWith('?')) {
    str = str.slice(1);
  }

  const result: Record<string, string | string[]> = {};

  if (str.length === 0) {
    return result;
  }

  const pairs = str.split('&');

  for (const pair of pairs) {
    const eqIndex = pair.indexOf('=');

    let key: string;
    let value: string;

    if (eqIndex === -1) {
      key = pair;
      value = '';
    } else {
      key = pair.slice(0, eqIndex);
      value = pair.slice(eqIndex + 1);
    }

    let decodedKey: string;
    let decodedValue: string;

    try {
      decodedKey = decodeURIComponent(key.replace(/\+/g, ' '));
    } catch {
      decodedKey = key;
    }

    try {
      decodedValue = decodeURIComponent(value.replace(/\+/g, ' '));
    } catch {
      decodedValue = value;
    }

    if (decodedKey === '') {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(result, decodedKey)) {
      const existing = result[decodedKey];
      if (Array.isArray(existing)) {
        existing.push(decodedValue);
      } else {
        result[decodedKey] = [existing, decodedValue];
      }
    } else {
      result[decodedKey] = decodedValue;
    }
  }

  return result;
}

export { parseQueryString };