// bloom-deps:

function parseQueryString(input: string): Record<string, string> {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, but received ${typeof input}`);
  }

  if (input === '') {
    return {};
  }

  let queryString = input;
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
    } catch (error) {
      throw new URIError(`Failed to decode key: ${rawKey}`);
    }

    try {
      decodedValue = decodeURIComponent(rawValue.replace(/\+/g, ' '));
    } catch (error) {
      throw new URIError(`Failed to decode value: ${rawValue}`);
    }

    result[decodedKey] = decodedValue;
  }

  return result;
}

export { parseQueryString };