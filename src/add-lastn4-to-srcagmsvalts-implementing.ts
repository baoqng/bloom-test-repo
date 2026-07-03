// bloom-deps:

export function lastN_4(array: unknown[], n: number): unknown[] {
  // Validate inputs using type guards
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }

  if (typeof n !== 'number') {
    throw new Error('n must be a number');
  }

  // Validate n is non-negative
  if (n < 0) {
    throw new Error('n must be >= 0');
  }

  // If n is 0, return empty array
  if (n === 0) {
    return [];
  }

  // If n >= array length, return the entire array
  if (n >= array.length) {
    return array.slice();
  }

  // Return the last n elements using slice with proper offset calculation
  const offset = array.length - n;
  return array.slice(offset);
}