// bloom-deps:

export function dedupeSorted_7(arr: number[]): number[] {
  if (arr.length === 0) {
    return [];
  }

  const result: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    if (typeof current !== 'number') {
      continue;
    }
    if (i === 0 || current !== arr[i - 1]) {
      result.push(current);
    }
  }

  return result;
}