// bloom-deps:

export function pageItemNumbersV8(pageSize: number, page: number): number[] {
  // Validate inputs: both must be integers > 0
  if (
    !Number.isInteger(pageSize) ||
    pageSize <= 0 ||
    !Number.isInteger(page) ||
    page <= 0
  ) {
    return [];
  }

  // Calculate start item number (1-indexed)
  const startItem = (page - 1) * pageSize + 1;

  // Calculate end item number (inclusive)
  const endItem = page * pageSize;

  // Generate array of item numbers from start to end inclusive
  const items = Array.from(
    { length: pageSize },
    (_, i) => startItem + i
  );

  return items;
}