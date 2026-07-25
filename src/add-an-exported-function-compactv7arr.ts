// bloom-deps:

export function compactV7(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array', { cause: new TypeError('arr is not an array') });
  }

  const result: unknown[] = [];
  
  for (const item of arr) {
    if (item) {
      result.push(item);
    }
  }
  
  return result;
}