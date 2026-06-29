// bloom-deps:

export function filterUniqueBy<T>(items: unknown, keyFn: unknown): T[] {
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

  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of items as T[]) {
    const key = (keyFn as (item: T) => unknown)(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}