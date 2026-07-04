// bloom-deps:

export function pageItemNumbersV3(pageSize: number, page: number): number[] {
  // Validate pageSize: must be an integer > 0
  if (typeof pageSize !== 'number' || !Number.isInteger(pageSize) || pageSize <= 0) {
    return [];
  }

  // Validate page: must be an integer > 0
  if (typeof page !== 'number' || !Number.isInteger(page) || page <= 0) {
    return [];
  }

  // Calculate the starting item number (1-indexed)
  const startItem = (page - 1) * pageSize + 1;

  // Calculate the ending item number (inclusive)
  const endItem = page * pageSize;

  // Generate array of item numbers from startItem to endItem
  const result: number[] = [];
  for (let i = startItem; i <= endItem; i++) {
    result.push(i);
  }

  return result;
}