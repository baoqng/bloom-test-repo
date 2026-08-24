// bloom-deps:

function parseQueryString(qs: string): Record<string, string | string[]> {
  if (typeof qs !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const trimmed = qs.trim();
  if (!trimmed) {
    return {};
  }

  const stripped = trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;

  const result: Record<string, string | string[]> = {};

  for (const pair of stripped.split('&')) {
    if (!pair) continue;

    const idx = pair.indexOf('=');
    let rawKey: string;
    let rawValue: string;

    if (idx === -1) {
      rawKey = pair;
      rawValue = '';
    } else {
      rawKey = pair.slice(0, idx);
      rawValue = pair.slice(idx + 1);
    }

    let key: string;
    let value: string;

    try {
      key = decodeURIComponent(rawKey);
    } catch {
      key = rawKey;
    }

    try {
      value = decodeURIComponent(rawValue);
    } catch {
      value = rawValue;
    }

    if (!key) continue;

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const existing = result[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        result[key] = [existing, value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

export { parseQueryString };