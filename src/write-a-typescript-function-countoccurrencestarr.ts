// bloom-deps:

function countOccurrences<T>(arr: T[], value: T): number {
  // Validate that arr is an Array
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an Array');
  }

  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];

    // Handle NaN case: NaN === NaN is false, so we use Number.isNaN
    if (typeof value === 'number' && Number.isNaN(value)) {
      if (typeof element === 'number' && Number.isNaN(element)) {
        count++;
      }
    } else {
      // For all other values, use strict equality
      if (element === value) {
        count++;
      }
    }
  }

  return count;
}

export { countOccurrences };