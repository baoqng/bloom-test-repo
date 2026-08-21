// bloom-deps:

function createPaginationMeta(
  total: number,
  page: number,
  pageSize: number
): {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  if (!Number.isInteger(total) || !isFinite(total) || total < 0) {
    throw new RangeError('total must be a non-negative integer');
  }

  if (!Number.isInteger(page) || !isFinite(page) || page < 1) {
    throw new RangeError('page must be a positive integer');
  }

  if (!Number.isInteger(pageSize) || !isFinite(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize must be a positive integer');
  }

  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}

export { createPaginationMeta };