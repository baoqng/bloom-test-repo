// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildCanonicalHeaders(headers: unknown): string {
  if (headers === null || typeof headers !== 'object' || Array.isArray(headers)) {
    throw new TypeError('headers must be an object');
  }

  const headersObj = headers as Record<string, unknown>;
  const ownKeys = Object.keys(headersObj);

  if (ownKeys.length === 0) {
    return '';
  }

  const entries: Array<[string, string]> = [];

  for (const key of ownKeys) {
    const value = headersObj[key];
    if (typeof value !== 'string') {
      throw new TypeError('header value must be a string');
    }
    const lowercasedKey = key.toLowerCase();
    const normalizedValue = value.trim().replace(/[ \t]+/g, ' ');
    entries.push([lowercasedKey, normalizedValue]);
  }

  entries.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);

  let result = '';
  for (const [key, value] of entries) {
    result += `${key}:${value}\n`;
  }

  return result;
}