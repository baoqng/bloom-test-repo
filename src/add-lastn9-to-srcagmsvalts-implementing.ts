// bloom-deps:

export function lastN_9(array: unknown[], n: number): unknown[] {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }

  if (n === 0) {
    return [];
  }

  if (n >= array.length) {
    return [...array];
  }

  return array.slice(-n);
}