export function lastN_34(arr: unknown, n: unknown): unknown[] {
  // Validate inputs with type guards
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array');
  }
  
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('Second argument must be an integer');
  }
  
  // Guard against negative n
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  
  // n=0 means return empty array
  if (n === 0) {
    return [];
  }
  
  // If n >= array length, return entire array
  if (n >= arr.length) {
    return arr;
  }
  
  // Use slice with negative index for last n elements
  return arr.slice(-n);
}