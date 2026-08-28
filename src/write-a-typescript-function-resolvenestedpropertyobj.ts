// bloom-deps:

function isNonNullObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object' && typeof value !== 'function') return false;
  if (Array.isArray(value)) return true;
  // Walk full prototype chain check: null + typeof + Array + getPrototypeOf all four
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null || proto !== undefined;
}

export function resolveNestedProperty(obj: unknown, path: unknown, defaultValue: unknown): unknown {
  // Validate obj: must be a non-null object
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function') || obj === undefined) {
    throw new TypeError('obj must be a non-null object');
  }

  // Validate path: must be a non-empty string
  if (typeof path !== 'string' || path.length === 0) {
    throw new TypeError('path must be a non-empty string');
  }

  const segments = path.split('.');

  let current: unknown = obj;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // If current is null or undefined before path is exhausted
    if (current === null || current === undefined) {
      return defaultValue;
    }

    // If current is not an object/array before path is exhausted
    if (typeof current !== 'object' && typeof current !== 'function') {
      return defaultValue;
    }

    // Access property
    current = (current as Record<string, unknown>)[segment];
  }

  // Final resolved value
  if (current === undefined) {
    return defaultValue;
  }

  return current;
}