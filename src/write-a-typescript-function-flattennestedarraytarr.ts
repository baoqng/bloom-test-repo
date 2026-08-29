// bloom-deps:

function flattenNestedArray<T>(arr: unknown, depth: unknown): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }

  if (
    typeof depth !== 'number' ||
    !Number.isFinite(depth) && depth !== Infinity ||
    (!Number.isInteger(depth) && depth !== Infinity) ||
    (typeof depth === 'number' && Number.isFinite(depth) && (!Number.isInteger(depth) || depth < 0))
  ) {
    throw new TypeError('depth must be a non-negative integer');
  }

  // Additional check: depth must be >= 0
  if (typeof depth === 'number' && Number.isFinite(depth) && depth < 0) {
    throw new TypeError('depth must be a non-negative integer');
  }

  function flatten(input: unknown[], currentDepth: number): T[] {
    const result: T[] = [];
    for (let i = 0; i < input.length; i++) {
      const element = input[i];
      if (Array.isArray(element) && currentDepth > 0) {
        const flattened = flatten(element, currentDepth === Infinity ? Infinity : currentDepth - 1);
        for (let j = 0; j < flattened.length; j++) {
          result.push(flattened[j]);
        }
      } else {
        result.push(element as T);
      }
    }
    return result;
  }

  return flatten(arr, depth as number);
}

export { flattenNestedArray };