// bloom-deps:

export function lastN_59(array: unknown[], n: number): unknown[] {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('Second argument must be an integer');
  }

  if (n < 0) {
    throw new RangeError('n must be non-negative');
  }

  if (n === 0) {
    return [];
  }

  if (n >= array.length) {
    return [...array];
  }

  return array.slice(array.length - n);
}