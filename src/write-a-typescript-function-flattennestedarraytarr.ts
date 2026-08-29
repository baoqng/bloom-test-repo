// bloom-deps:

function flattenNestedArray<T>(arr: unknown, depth: unknown): T[] {
  // Validate arr is an array
  if (!Array.isArray(arr)) {
    throw new TypeError("arr must be an array");
  }

  // Validate depth is a non-negative integer or Infinity
  if (
    typeof depth !== "number" ||
    (depth !== Infinity && (!Number.isInteger(depth) || depth < 0))
  ) {
    throw new TypeError("depth must be a non-negative integer");
  }

  // At depth 0, return array as-is
  if (depth === 0) {
    return Array.from(arr) as T[];
  }

  // Recursive helper function
  function flattenHelper(input: unknown[], currentDepth: number): T[] {
    const result: T[] = [];

    for (const item of input) {
      if (Array.isArray(item) && currentDepth > 0) {
        // Recursively flatten if item is array and we have depth remaining
        const flattened = flattenHelper(item, currentDepth - 1);
        result.push(...flattened);
      } else {
        // Preserve non-array elements exactly as-is
        result.push(item as T);
      }
    }

    return result;
  }

  // For Infinity, use a very large depth number that won't be exhausted
  const maxDepth = depth === Infinity ? Number.MAX_SAFE_INTEGER : depth;

  return flattenHelper(arr, maxDepth);
}

export { flattenNestedArray };