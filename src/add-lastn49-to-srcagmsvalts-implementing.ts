// bloom-deps:

export function lastN_49(arr: unknown, n: unknown): unknown[] {
  // Validate inputs - unknown types must be validated with a schema before property access
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array');
  }

  if (typeof n !== 'number') {
    throw new TypeError('Second argument must be a number');
  }

  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }

  // Return the last n elements
  // If n >= array length, return entire array
  // If n is 0, return empty array
  const startIndex = Math.max(0, arr.length - n);
  return arr.slice(startIndex);
}