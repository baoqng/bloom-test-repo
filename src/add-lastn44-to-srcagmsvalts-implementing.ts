// bloom-deps:

export function lastN_44(arr: unknown, n: unknown): unknown[] {
  // Validate input is an array
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array');
  }

  // Validate n is a number
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('Second argument must be an integer');
  }

  // Validate n is non-negative
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }

  // Return last n elements
  if (n === 0) {
    return [];
  }

  if (n >= arr.length) {
    return arr.slice();
  }

  return arr.slice(-n);
}