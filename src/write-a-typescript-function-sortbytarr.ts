// bloom-deps:

export function sortBy<T>(
  arr: T[],
  keyFn: (item: T) => string | number,
  direction?: 'asc' | 'desc'
): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError("'arr' must be an Array");
  }

  if (typeof keyFn !== 'function') {
    throw new TypeError("'keyFn' must be a function");
  }

  if (direction !== undefined) {
    if (typeof direction !== 'string' || direction.length === 0) {
      throw new TypeError("'direction' must be 'asc' or 'desc'");
    }
    if (direction !== 'asc' && direction !== 'desc') {
      throw new RangeError("'direction' must be 'asc' or 'desc'");
    }
  }

  const effectiveDirection = direction === undefined ? 'asc' : direction;

  const copy = arr.slice();

  copy.sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    let comparison: number;

    if (typeof keyA === 'string' && typeof keyB === 'string') {
      comparison = keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
    } else if (typeof keyA === 'number' && typeof keyB === 'number') {
      comparison = keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
    } else {
      const strA = String(keyA);
      const strB = String(keyB);
      comparison = strA < strB ? -1 : strA > strB ? 1 : 0;
    }

    return effectiveDirection === 'desc' ? -comparison : comparison;
  });

  return copy;
}