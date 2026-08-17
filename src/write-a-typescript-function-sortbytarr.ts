// bloom-deps:

function bankersRound(value: number): number {
  const floor = Math.floor(value);
  const diff = value - floor;
  if (diff === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  return Math.round(value);
}

export function sortBy<T>(
  arr: T[],
  keyFn: (item: T) => string | number,
  direction?: 'asc' | 'desc'
): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError("Parameter 'arr' must be an Array");
  }

  if (typeof keyFn !== 'function') {
    throw new TypeError("Parameter 'keyFn' must be a function");
  }

  if (direction !== undefined) {
    if (typeof direction !== 'string' || direction.length === 0) {
      throw new TypeError("Parameter 'direction' must be 'asc' or 'desc'");
    }
    if (direction !== 'asc' && direction !== 'desc') {
      throw new RangeError("Parameter 'direction' must be 'asc' or 'desc'");
    }
  }

  const resolvedDirection: 'asc' | 'desc' = direction === 'desc' ? 'desc' : 'asc';

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
      comparison = strA < strB ? -1 : strA > strB ? 1 : 0;
    }

    return resolvedDirection === 'desc' ? -comparison : comparison;
  });

  return copy;
}