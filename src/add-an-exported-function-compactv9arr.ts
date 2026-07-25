// bloom-deps:

export function compactV9(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array', { cause: new TypeError('Expected array') });
  }

  const result: unknown[] = [];

  for (const item of arr) {
    if (item) {
      result.push(item);
    }
  }

  return result;
}