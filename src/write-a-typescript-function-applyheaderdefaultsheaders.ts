// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Check that Object.prototype is the direct prototype (plain object)
      // If there's anything between value's proto and Object.prototype, it's a class instance
      return Object.getPrototypeOf(value) === Object.prototype;
    }
    proto = Object.getPrototypeOf(proto);
  }
  // proto chain ended at null without hitting Object.prototype as direct parent
  // This means Object.getPrototypeOf(value) === null (Object.create(null))
  return Object.getPrototypeOf(value) === null;
}

export function applyHeaderDefaults(headers: unknown, defaults: unknown): Record<string, string> {
  // Validate headers
  if (headers !== null) {
    if (!isPlainObject(headers)) {
      throw new TypeError('headers must be a plain object');
    }
  }

  // Validate defaults
  if (defaults !== null) {
    if (!isPlainObject(defaults)) {
      throw new TypeError('defaults must be a plain object');
    }
  }

  const headersObj = (headers ?? {}) as Record<string, unknown>;
  const defaultsObj = (defaults ?? {}) as Record<string, unknown>;

  // Validate all own-property values in headers are strings
  for (const key of Object.keys(headersObj)) {
    if (typeof headersObj[key] !== 'string') {
      throw new TypeError('all header values must be strings');
    }
  }

  // Validate all own-property values in defaults are strings
  for (const key of Object.keys(defaultsObj)) {
    if (typeof defaultsObj[key] !== 'string') {
      throw new TypeError('all header values must be strings');
    }
  }

  const result: Record<string, string> = {};

  // Add all headers entries
  for (const key of Object.keys(headersObj)) {
    result[key] = headersObj[key] as string;
  }

  // Add defaults entries that don't conflict case-insensitively with headers
  const headersKeysLower = Object.keys(headersObj).map(k => k.toLowerCase());

  for (const key of Object.keys(defaultsObj)) {
    const keyLower = key.toLowerCase();
    if (!headersKeysLower.includes(keyLower)) {
      result[key] = defaultsObj[key] as string;
    }
  }

  return result;
}