// bloom-deps:

export function pageItemNumbersV4(pageSize: number, page: number): number[] {
  if (
    !Number.isInteger(pageSize) ||
    !Number.isInteger(page) ||
    pageSize <= 0 ||
    page <= 0
  ) {
    return [];
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = page * pageSize;

  const result: number[] = [];
  for (let i = startItem; i <= endItem; i++) {
    result.push(i);
  }
  return result;
}