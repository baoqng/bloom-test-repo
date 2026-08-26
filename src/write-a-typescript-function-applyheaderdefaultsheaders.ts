// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function applyHeaderDefaults(headers: unknown, defaults: unknown): Record<string, string> {
  if (headers !== null && !isPlainObject(headers)) {
    throw new TypeError("headers must be a plain object");
  }
  if (defaults !== null && !isPlainObject(defaults)) {
    throw new TypeError("defaults must be a plain object");
  }

  const headersObj = (headers ?? {}) as Record<string, unknown>;
  const defaultsObj = (defaults ?? {}) as Record<string, unknown>;

  // Validate all header values are strings
  for (const key of Object.keys(headersObj)) {
    if (typeof headersObj[key] !== 'string') {
      throw new TypeError("all header values must be strings");
    }
  }
  for (const key of Object.keys(defaultsObj)) {
    if (typeof defaultsObj[key] !== 'string') {
      throw new TypeError("all header values must be strings");
    }
  }

  const result: Record<string, string> = {};

  // Add all headers entries
  for (const key of Object.keys(headersObj)) {
    result[key] = headersObj[key] as string;
  }

  // Build a lowercase map of keys already in result (from headers)
  const headersLowerKeys = new Set(Object.keys(headersObj).map(k => k.toLowerCase()));

  // Add defaults entries that don't conflict case-insensitively
  for (const key of Object.keys(defaultsObj)) {
    if (!headersLowerKeys.has(key.toLowerCase())) {
      result[key] = defaultsObj[key] as string;
    }
  }

  return result;
}