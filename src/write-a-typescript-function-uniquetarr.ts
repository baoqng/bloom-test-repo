// bloom-deps:

type KeyFunction<T> = (item: T) => unknown;

export function unique<T>(arr: T[], keyFn?: KeyFunction<T>): T[] {
  // Validate arr is an Array
  if (!Array.isArray(arr)) {
    throw new TypeError(
      `Expected arr to be an Array, got ${typeof arr === "object" && arr === null ? "null" : typeof arr}`
    );
  }

  // Validate keyFn if provided
  if (keyFn !== undefined && typeof keyFn !== "function") {
    throw new TypeError(
      `Expected keyFn to be a function or undefined, got ${typeof keyFn}`
    );
  }

  // Use Set to track seen values
  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of arr) {
    const key = keyFn ? keyFn(item) : item;

    // Check if we've seen this key before
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}