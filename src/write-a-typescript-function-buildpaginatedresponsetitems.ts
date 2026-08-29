// bloom-deps:

export function buildPaginatedResponse<T>(
  items: unknown,
  page: unknown,
  pageSize: unknown,
  total: unknown
): {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  if (
    typeof page !== 'number' ||
    !Number.isFinite(page) ||
    !Number.isInteger(page) ||
    page <= 0
  ) {
    throw new TypeError('page must be a positive integer');
  }

  if (
    typeof pageSize !== 'number' ||
    !Number.isFinite(pageSize) ||
    !Number.isInteger(pageSize) ||
    pageSize <= 0
  ) {
    throw new TypeError('pageSize must be a positive integer');
  }

  if (
    typeof total !== 'number' ||
    !Number.isFinite(total) ||
    !Number.isInteger(total) ||
    total < 0
  ) {
    throw new TypeError('total must be a non-negative integer');
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (page > totalPages && total > 0) {
    throw new RangeError('page exceeds total pages');
  }

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    data: items as T[],
    page,
    pageSize,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
}