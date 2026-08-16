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

  const dir = direction === 'desc' ? -1 : 1;

  return [...arr].sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    if (keyA < keyB) return -1 * dir;
    if (keyA > keyB) return 1 * dir;
    return 0;
  });
}