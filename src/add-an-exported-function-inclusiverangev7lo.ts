// bloom-deps:

export function inclusiveRangeV7(lo: number, hi: number): number[] {
  if (lo > hi) {
    return [];
  }
  
  const result: number[] = [];
  for (let i = lo; i <= hi; i++) {
    result.push(i);
  }
  return result;
}