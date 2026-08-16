// bloom-deps:

export function sortBy<T>(
  arr: T[],
  keyFn: (item: T) => string | number,
  direction?: 'asc' | 'desc'
): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but got ${typeof arr}`);
  }

  if (typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, but got ${typeof keyFn}`);
  }

  if (direction !== undefined && direction !== 'asc' && direction !== 'desc') {
    throw new RangeError(`Expected direction to be 'asc' or 'desc', but got '${direction}'`);
  }

  const resolvedDirection = direction ?? 'asc';

  const copy = [...arr];

  copy.sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);

    if (typeof aKey === 'number' && typeof bKey === 'number') {
      return resolvedDirection === 'asc' ? aKey - bKey : bKey - aKey;
    }

    const aStr = String(aKey);
    const bStr = String(bKey);

    if (aStr < bStr) {
      return resolvedDirection === 'asc' ? -1 : 1;
    }
    if (aStr > bStr) {
      return resolvedDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return copy;
}