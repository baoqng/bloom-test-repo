// bloom-deps:

export function compactV10(arr: unknown[]): unknown[] {
  const result: unknown[] = [];
  
  for (const item of arr) {
    if (item) {
      result.push(item);
    }
  }
  
  return result;
}