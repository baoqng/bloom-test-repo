// bloom-deps:

export function sortBy<T>(
  arr: T[],
  keyFn: (item: T) => string | number,
  direction?: 'asc' | 'desc'
): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
  }
  if (direction !== undefined && direction !== 'asc' && direction !== 'desc') {
    throw new RangeError("direction must be 'asc' or 'desc'");
  }

  const effectiveDirection = direction ?? 'asc';
  const copy = [...arr];

  copy.sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    let comparison: number;

    if (typeof keyA === 'number' && typeof keyB === 'number') {
      comparison = keyA - keyB;
    } else {
      const strA = String(keyA);
      const strB = String(keyB);
      if (strA < strB) {
        comparison = -1;
      } else if (strA > strB) {
        comparison = 1;
      } else {
        comparison = 0;
      }
    }

    return effectiveDirection === 'desc' ? -comparison : comparison;
  });

  return copy;
}