// bloom-deps:

function buildQueryString(params: Record<string, string | number | boolean | string[]>): string {
  if (
    typeof params !== 'object' ||
    params === null ||
    Array.isArray(params) ||
    Object.getPrototypeOf(params) !== Object.prototype
  ) {
    throw new TypeError('Expected a plain object');
  }

  const parts: string[] = [];

  for (const key of Object.keys(params)) {
    const value = params[key];

    if (value === null || value === undefined) {
      continue;
    }

    const encodedKey = encodeURIComponent(key);

    if (Array.isArray(value)) {
      for (const item of value) {
        parts.push(`${encodedKey}=${encodeURIComponent(item)}`);
      }
    } else {
      parts.push(`${encodedKey}=${encodeURIComponent(value)}`);
    }
  }

  return parts.join('&');
}

export { buildQueryString };