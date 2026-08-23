// bloom-deps:

function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  // Validate arr parameter
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  // Validate keyFn parameter if provided
  if (keyFn !== undefined && typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
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

  // If keyFn is provided, use keyFn-based comparison
  const seen = new Set<unknown>();
  const result: T[] = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export { unique };