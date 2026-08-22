// bloom-deps:

function buildPaginatedResponse<T>(params: {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  baseUrl: string;
}): {
  items: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextUrl: string | null;
    prevUrl: string | null;
  };
} {
  // Validate params is a plain object
  if (
    typeof params !== 'object' ||
    params === null ||
    Array.isArray(params) ||
    Object.getPrototypeOf(params) !== Object.prototype
  ) {
    throw new TypeError('params must be a plain object');
  }

  const { items, total, page, pageSize, baseUrl } = params;

  // Validate items is an array
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  // Validate total is a non-negative integer
  if (!Number.isInteger(total) || total < 0) {
    throw new RangeError('total must be a non-negative integer');
  }

  // Validate page is a positive integer
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('page must be a positive integer');
  }

  // Validate pageSize is a positive integer
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize must be a positive integer');
  }

  // Validate baseUrl is a non-empty string
  if (typeof baseUrl !== 'string' || baseUrl.length === 0) {
    throw new TypeError('baseUrl must be a non-empty string');
  }

  // Calculate totalPages (minimum 1)
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Calculate hasNextPage and hasPrevPage
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Build nextUrl and prevUrl
  const nextUrl = hasNextPage
    ? `${baseUrl}?page=${page + 1}&pageSize=${pageSize}`
    : null;
  const prevUrl = hasPrevPage
    ? `${baseUrl}?page=${page - 1}&pageSize=${pageSize}`
    : null;

  return {
    items,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextUrl,
      prevUrl,
    },
  };
}

export { buildPaginatedResponse };