// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype;
}

export function applySchemaDefaults<T extends Record<string, unknown>>(
  input: unknown,
  defaults: unknown
): T {
  if (!isPlainObject(input)) {
    throw new TypeError('input must be a plain object');
  }

  if (!isPlainObject(defaults)) {
    throw new TypeError('defaults must be a plain object');
  }

  const result: Record<string, unknown> = {};

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      result[key] = (input as Record<string, unknown>)[key];
    }
  }

  for (const key in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, key)) {
      if (!Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = (defaults as Record<string, unknown>)[key];
      }
    }
  }

  return result as T;
}