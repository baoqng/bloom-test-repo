// bloom-deps:

export function lastN_4(array: unknown[], n: number): unknown[] {
  if (n <= 0) {
    return [];
  }
  
  if (n >= array.length) {
    return [...array];
  }
  
  return array.slice(-n);
}