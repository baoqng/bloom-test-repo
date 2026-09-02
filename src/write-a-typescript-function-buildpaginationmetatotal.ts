// bloom-deps:

export function buildPaginationMeta(
  total: number,
  page: number,
  pageSize: number
): {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  if (
    typeof total !== 'number' ||
    !Number.isInteger(total) ||
    total < 0
  ) {
    throw new TypeError('total must be a non-negative integer');
  }

  if (
    typeof page !== 'number' ||
    !Number.isInteger(page) ||
    page < 1
  ) {
    throw new TypeError('page must be a positive integer');
  }

  if (
    typeof pageSize !== 'number' ||
    !Number.isInteger(pageSize) ||
    pageSize < 1
  ) {
    throw new TypeError('pageSize must be a positive integer');
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNext,
    hasPrev,
  };
}