// bloom-deps:

export function getArrayElement<T>(arr: unknown, index: unknown): T {
  if (arr === null || arr === undefined) {
    throw new TypeError('arr is required');
  }
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (index === null || index === undefined) {
    throw new TypeError('index is required');
  }
  if (typeof index !== 'number') {
    throw new TypeError('index must be a number');
  }
  if (index < 0) {
    throw new RangeError('index must be non-negative');
  }
  if (index >= arr.length) {
    throw new RangeError('index ' + index + ' is out of bounds for array of length ' + arr.length);
  }
  return arr[index] as T;
}