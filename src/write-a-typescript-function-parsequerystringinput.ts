// bloom-deps:

function parseQueryString(input: string): Record<string, string> {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  if (input === '') {
    return {};
  }

  let query = input;
  if (query.startsWith('?')) {
    query = query.slice(1);
  }

  if (query === '') {
    return {};
  }

  const result: Record<string, string> = {};
  const pairs = query.split('&');

  for (const pair of pairs) {
    if (pair === '') {
      continue;
    }

    const delimiterIndex = pair.indexOf('=');
    let rawKey: string;
    let rawValue: string;

    if (delimiterIndex === -1) {
      rawKey = pair;
      rawValue = '';
    } else {
      rawKey = pair.slice(0, delimiterIndex);
      rawValue = pair.slice(delimiterIndex + 1);
    }

    const decodedKey = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const decodedValue = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    result[decodedKey] = decodedValue;
  }

  return result;
}

export { parseQueryString };