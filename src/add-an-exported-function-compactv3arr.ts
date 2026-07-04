// bloom-deps:

export function compactV3(arr: unknown[]): unknown[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  const result: unknown[] = [];

  for (const item of arr) {
    if (item) {
      result.push(item);
    }
  }

  return result;
}