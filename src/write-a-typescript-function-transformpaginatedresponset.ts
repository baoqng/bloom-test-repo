// bloom-deps:

function transformPaginatedResponse<T, U>(
  data: T[],
  transform: (item: T) => U,
  pagination: { page: number; limit: number; total: number }
): {
  data: U[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
} {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an Array');
  }
  if (typeof transform !== 'function') {
    throw new TypeError('transform must be a function');
  }

  const { page, limit, total } = pagination;

  if (typeof page !== 'number' || !isFinite(page) || page < 1) {
    throw new RangeError('page must be >= 1');
  }
  if (typeof limit !== 'number' || !isFinite(limit) || limit < 1) {
    throw new RangeError('limit must be >= 1');
  }
  if (typeof total !== 'number' || !isFinite(total) || total < 0) {
    throw new RangeError('total must be >= 0');
  }

  const transformedData: U[] = data.map(transform);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage: number | null = hasNextPage ? page + 1 : null;
  const prevPage: number | null = hasPrevPage ? page - 1 : null;

  return {
    data: transformedData,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
    },
  };
}

export { transformPaginatedResponse };