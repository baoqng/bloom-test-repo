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

  if (typeof page !== 'number' || page < 1) {
    throw new RangeError('page must be >= 1');
  }

  if (typeof limit !== 'number' || limit < 1) {
    throw new RangeError('limit must be >= 1');
  }

  if (typeof total !== 'number' || total < 0) {
    throw new RangeError('total must be >= 0');
  }

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;

  const transformedData = data.map((item) => transform(item));

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