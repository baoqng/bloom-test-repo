// bloom-deps:

export function pickKeys<T extends object>(obj: unknown, keys: unknown): Partial<T> {
  if (obj === null || obj === undefined) {
    throw new TypeError('obj is required');
  }
  if (keys === null || keys === undefined) {
    throw new TypeError('keys is required');
  }
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('obj must be a plain object');
  }
  if (!Array.isArray(keys)) {
    throw new TypeError('keys must be an Array');
  }

  const result: Partial<T> = {};
  const plainObj = obj as Record<string, unknown>;

  for (const key of keys) {
    if (typeof key === 'string' && Object.prototype.propertyIsEnumerable.call(plainObj, key)) {
      (result as Record<string, unknown>)[key] = plainObj[key];
    }
  }

  return result;
}