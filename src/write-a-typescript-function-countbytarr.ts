// bloom-deps:

export function countBy<T>(
  arr: T[],
  keyFn: (item: T) => string
): Record<string, number> {
  // Validate arr is an Array
  if (!Array.isArray(arr)) {
    throw new TypeError(
      `Expected arr to be an Array, but received ${typeof arr}`
    );
  }

  // Validate keyFn is a function
  if (typeof keyFn !== "function") {
    throw new TypeError(
      `Expected keyFn to be a function, but received ${typeof keyFn}`
    );
  }

  // Build the count map
  const result: Record<string, number> = {};

  for (const item of arr) {
    const key = keyFn(item);
    result[key] = (result[key] ?? 0) + 1;
  }

  return result;
}