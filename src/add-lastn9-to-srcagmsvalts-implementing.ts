// bloom-deps:

export function lastN_9(arr: unknown[], n: number): unknown[] {
  // Validate input: arr must be an array
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array');
  }

  // Validate input: n must be a non-negative number
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new TypeError('Second argument must be a non-negative integer');
  }

  // If n is 0 or greater than array length, handle appropriately
  if (n === 0) {
    return [];
  }

  if (n >= arr.length) {
    return [...arr];
  }

  // Return the last n elements
  const startIndex = arr.length - n;
  return arr.slice(startIndex);
}