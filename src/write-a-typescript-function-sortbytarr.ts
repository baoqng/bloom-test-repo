// bloom-deps:

export function sortBy<T>(
  arr: T[],
  keyFn: (item: T) => string | number,
  direction?: 'asc' | 'desc'
): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr}`);
  }

  if (typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, but received ${typeof keyFn}`);
  }

  if (direction !== undefined && direction !== 'asc' && direction !== 'desc') {
    throw new RangeError(`Expected direction to be 'asc' or 'desc', but received '${direction}'`);
  }

  const resolvedDirection = direction ?? 'asc';

  const copy = [...arr];

  copy.sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);

    if (typeof aKey === 'string' && typeof bKey === 'string') {
      const cmp = aKey.localeCompare(bKey);
      return resolvedDirection === 'asc' ? cmp : -cmp;
    }

    if (typeof aKey === 'number' && typeof bKey === 'number') {
      const cmp = aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
      return resolvedDirection === 'asc' ? cmp : -cmp;
    }

    const aStr = String(aKey);
    const bStr = String(bKey);
    const cmp = aStr.localeCompare(bStr);
    return resolvedDirection === 'asc' ? cmp : -cmp;
  });

  return copy;
}