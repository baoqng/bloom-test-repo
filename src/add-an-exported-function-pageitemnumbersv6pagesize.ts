// bloom-deps:

export function pageItemNumbersV6(pageSize: number, page: number): number[] {
  // Validate pageSize is a positive integer
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    return [];
  }

  // Validate page is a positive integer
  if (!Number.isInteger(page) || page <= 0) {
    return [];
  }

  // Calculate the starting item number (1-indexed)
  const startItem = (page - 1) * pageSize + 1;

  // Calculate the ending item number (inclusive)
  const endItem = page * pageSize;

  // Generate array of item numbers from startItem to endItem inclusive
  const result: number[] = [];
  for (let i = startItem; i <= endItem; i++) {
    result.push(i);
  }

  return result;
}