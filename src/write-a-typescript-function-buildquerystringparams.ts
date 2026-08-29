// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildQueryString(params: unknown): string {
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain object');
  }

  const record = params as Record<string, unknown>;
  const parts: string[] = [];

  for (const key of Object.keys(record)) {
    const value = record[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const element of value) {
        if (element === null || element === undefined) {
          continue;
        }
        if (isPlainObject(element)) {
          throw new TypeError(`Nested objects not supported for key ${key}`);
        }
        if (
          typeof element !== 'string' &&
          typeof element !== 'number' &&
          typeof element !== 'boolean'
        ) {
          throw new TypeError(`Unsupported value type for key ${key}`);
        }
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(element))}`);
      }
      continue;
    }

    if (isPlainObject(value)) {
      throw new TypeError(`Nested objects not supported for key ${key}`);
    }

    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean'
    ) {
      throw new TypeError(`Unsupported value type for key ${key}`);
    }

    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  return parts.join('&');
}