// bloom-deps:

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function paginateResults<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  if (page < 1) {
    throw new RangeError("page must be >= 1");
  }

  if (pageSize < 1) {
    throw new RangeError("pageSize must be >= 1");
  }

  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const slicedItems = items.slice(startIndex, endIndex);

  return {
    items: slicedItems,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export { paginateResults, PaginatedResult };