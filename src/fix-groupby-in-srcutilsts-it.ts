// bloom-deps:

export function groupBy<T>(items: unknown, keyFn: unknown): Record<string, T[]> {
  if (items === null || items === undefined) {
    throw new TypeError('items is required');
  }
  if (keyFn === null || keyFn === undefined) {
    throw new TypeError('keyFn is required');
  }
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an Array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
  }

  const result: Record<string, T[]> = {};

  for (const item of items as T[]) {
    const key = String(keyFn(item));
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}