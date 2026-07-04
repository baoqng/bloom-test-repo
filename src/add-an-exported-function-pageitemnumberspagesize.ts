// bloom-deps:

export function pageItemNumbers(pageSize: number, page: number): number[] {
  if (
    !Number.isInteger(pageSize) ||
    pageSize <= 0 ||
    !Number.isInteger(page) ||
    page <= 0
  ) {
    return [];
  }

  const startItem = (page - 1) * pageSize + 1;
  return Array.from({ length: pageSize }, (_, i) => startItem + i);
}