// bloom-deps:

export function lastN_4(array: unknown, n: unknown): unknown[] {
  // Validate inputs using type guards
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }
  
  if (typeof n !== 'number') {
    throw new TypeError('Second argument must be a number');
  }
  
  if (!Number.isInteger(n)) {
    throw new TypeError('Second argument must be an integer');
  }
  
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  
  // Return the last n elements
  if (n === 0) {
    return [];
  }
  
  if (n >= array.length) {
    return array;
  }
  
  return array.slice(-n);
}