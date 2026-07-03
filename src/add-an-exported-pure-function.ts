// bloom-deps:

export function dedupeSorted_7(arr: number[]): number[] {
  if (arr.length === 0) {
    return [];
  }

  const result: number[] = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      result.push(arr[i]);
    }
  }

  return result;
}