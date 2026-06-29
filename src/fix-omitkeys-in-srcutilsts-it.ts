// bloom-deps:

export function omitKeys<T extends object>(obj: T, keys: (keyof T)[]): Partial<T> {
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

  const keySet = new Set(keys as string[]);
  const result: Partial<T> = {};

  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (!keySet.has(key as string)) {
      result[key] = (obj as T)[key];
    }
  }

  return result;
}