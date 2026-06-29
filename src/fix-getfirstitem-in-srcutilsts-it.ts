// bloom-deps:

export function getFirstItem<T>(arr: unknown): T {
  if (arr === null || arr === undefined) {
    throw new TypeError('arr is required');
  }
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (arr.length === 0) {
    throw new RangeError('arr cannot be empty');
  }
  return arr[0] as T;
}