// bloom-deps:

export function chunk<T>(arr: unknown, size: unknown): T[][] {
  // Type validation for arr
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  // Type validation for size
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }

  // Validate size is a finite number
  if (!isFinite(size)) {
    throw new TypeError('size must be a finite number');
  }

  // Validate size is an integer
  if (!Number.isInteger(size)) {
    throw new TypeError('size must be an integer');
  }

  // Validate size is positive (>= 1)
  if (size < 1) {
    throw new RangeError('size must be greater than 0');
  }

  // Split array into chunks
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size) as T[]);
  }

  return result;
}