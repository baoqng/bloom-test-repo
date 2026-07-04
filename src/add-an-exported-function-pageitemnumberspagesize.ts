// bloom-deps:

export function pageItemNumbers(pageSize: number, page: number): number[] {
  // Validate inputs: both must be integers > 0
  if (
    typeof pageSize !== 'number' ||
    typeof page !== 'number' ||
    !Number.isInteger(pageSize) ||
    !Number.isInteger(page) ||
    pageSize <= 0 ||
    page <= 0
  ) {
    return [];
  }

  // Calculate start and end item numbers (1-indexed)
  const startItem = (page - 1) * pageSize + 1;
  const endItem = page * pageSize;

  // Generate array of item numbers using Array.from
  return Array.from({ length: pageSize }, (_, i) => startItem + i);
}