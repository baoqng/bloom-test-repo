// bloom-deps:

/**
 * Groups array items by a string key returned by the provided function.
 * 
 * @param arr - The array to group
 * @param keyFn - Function that returns a string key for each item
 * @returns Object with string keys mapping to arrays of items
 * @throws TypeError if arr is not an Array or keyFn is not a function
 */
function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  // Type validation: arr must be an Array
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, got ${typeof arr}`);
  }

  // Type validation: keyFn must be a function
  if (typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, got ${typeof keyFn}`);
  }

  const result: Record<string, T[]> = {};

  for (const item of arr) {
    let key: string;
    try {
      key = keyFn(item);
    } catch (error) {
      throw new Error('keyFn execution failed', { cause: error });
    }

    // Validate that keyFn returned a string
    if (typeof key !== 'string') {
      throw new TypeError(`keyFn must return a string, got ${typeof key}`);
    }

    // Initialize group if not exists
    if (!(key in result)) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

export { groupBy };