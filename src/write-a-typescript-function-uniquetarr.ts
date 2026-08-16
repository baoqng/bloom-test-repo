// bloom-deps:

type KeyFunction<T> = (item: T) => unknown;

/**
 * Removes duplicate items from an array.
 * @param arr - The array to deduplicate
 * @param keyFn - Optional function to extract comparison key from each item
 * @returns A new array with duplicates removed
 * @throws TypeError if arr is not an Array or keyFn is not a function (if provided)
 */
function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  // Validate arr is an Array
  if (!Array.isArray(arr)) {
    throw new TypeError("arr must be an Array");
  }

  // Validate keyFn is a function if provided
  if (keyFn !== undefined && typeof keyFn !== "function") {
    throw new TypeError("keyFn must be a function");
  }

  // If no keyFn provided, use strict equality comparison
  if (!keyFn) {
    const seen = new Set<T>();
    const result: T[] = [];
    for (const item of arr) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
    return result;
  }

  // Use keyFn for comparison
  const seenKeys = new Set<unknown>();
  const result: T[] = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push(item);
    }
  }
  return result;
}

export { unique };