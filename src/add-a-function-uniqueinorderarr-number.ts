// bloom-deps:

export function uniqueInOrder(arr: number[]): number[] {
  if (arr.length === 0) {
    return [];
  }

  const result: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (i === 0 || arr[i] !== arr[i - 1]) {
      result.push(arr[i]);
    }
  }

  return result;
}