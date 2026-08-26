// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return true;
}

export function flattenObject(obj: unknown, prefix: unknown): Record<string, unknown> {
  if (!isPlainObject(obj)) {
    throw new TypeError("obj must be a plain object");
  }
  if (typeof prefix !== 'string') {
    throw new TypeError("prefix must be a string");
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj as Record<string, unknown>)) {
    const value = (obj as Record<string, unknown>)[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      const nested = flattenObject(value, fullKey);
      for (const nestedKey of Object.keys(nested)) {
        result[nestedKey] = nested[nestedKey];
      }
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}