// bloom-deps:

export function pageItemNumbersV5(pageSize: number, page: number): number[] {
  // Validate that pageSize is an integer > 0
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    return [];
  }

  // Validate that page is an integer > 0
  if (!Number.isInteger(page) || page <= 0) {
    return [];
  }

  // Calculate the starting item number (1-indexed)
  // For page 1 with pageSize 3: start = (1-1)*3 + 1 = 1
  // For page 2 with pageSize 3: start = (2-1)*3 + 1 = 4
  const startItem = (page - 1) * pageSize + 1;

  // Calculate the ending item number (inclusive)
  // For page 1 with pageSize 3: end = 1*3 = 3
  // For page 2 with pageSize 3: end = 2*3 = 6
  const endItem = page * pageSize;

  // Generate array of item numbers from startItem to endItem (inclusive)
  const result: number[] = [];
  for (let i = startItem; i <= endItem; i++) {
    result.push(i);
  }

  return result;
}