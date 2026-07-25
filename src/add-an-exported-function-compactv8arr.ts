// bloom-deps:

export function compactV8(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array', { cause: new TypeError('Expected array') });
  }

  const result: unknown[] = [];

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element) {
      result.push(element);
    }
  }

  return result;
}