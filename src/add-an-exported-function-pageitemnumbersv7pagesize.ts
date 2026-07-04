// bloom-deps:

export function pageItemNumbersV7(pageSize: number, page: number): number[] {
  // Validate inputs: both must be integers > 0
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    return [];
  }
  if (!Number.isInteger(page) || page <= 0) {
    return [];
  }

  // Calculate the starting item number (1-indexed)
  // Page 1 starts at item 1, page 2 starts at item (pageSize + 1), etc.
  const startItem = (page - 1) * pageSize + 1;
  
  // Calculate the ending item number (inclusive)
  const endItem = page * pageSize;
  
  // Generate array of item numbers from startItem to endItem (inclusive)
  const items: number[] = [];
  for (let i = startItem; i <= endItem; i++) {
    items.push(i);
  }
  
  return items;
}