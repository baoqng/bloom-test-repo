// bloom-deps:

function parseQueryString(input: unknown): Record<string, string | string[]> {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  let str = input;
  if (str.startsWith('?')) {
    str = str.slice(1);
  }

  if (str === '') {
    return {};
  }

  const result: Record<string, string | string[]> = {};
  const segments = str.split('&');

  for (const segment of segments) {
    if (segment === '') {
      continue;
    }

    let key: string;
    let value: string;

    const delimIndex = segment.indexOf('=');
    if (delimIndex === -1) {
      key = segment;
      value = '';
    } else {
      key = segment.slice(0, delimIndex);
      value = segment.slice(delimIndex + 1);
    }

    let decodedKey: string;
    let decodedValue: string;

    try {
      decodedKey = decodeURIComponent(key);
    } catch {
      throw new SyntaxError('Malformed percent-encoding in query string');
    }

    try {
      decodedValue = decodeURIComponent(value);
    } catch {
      throw new SyntaxError('Malformed percent-encoding in query string');
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