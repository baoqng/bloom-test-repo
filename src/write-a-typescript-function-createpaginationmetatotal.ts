// bloom-deps:

export function createPaginationMeta(
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
  if (!Number.isInteger(total) || total < 0 || !Number.isFinite(total)) {
    throw new RangeError('total must be a non-negative integer');
  }

  if (!Number.isInteger(page) || page < 1 || !Number.isFinite(page)) {
    throw new RangeError('page must be a positive integer');
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || !Number.isFinite(pageSize)) {
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