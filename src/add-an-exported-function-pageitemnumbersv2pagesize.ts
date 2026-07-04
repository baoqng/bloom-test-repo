// bloom-deps:

export function pageItemNumbersV2(pageSize: number, page: number): number[] {
  if (
    !Number.isInteger(pageSize) ||
    pageSize <= 0 ||
    !Number.isInteger(page) ||
    page <= 0
  ) {
    return [];
  }

  const start = (page - 1) * pageSize + 1;
  const result: number[] = [];

  for (let i = start; i < start + pageSize; i++) {
    result.push(i);
  }

  return result;
}