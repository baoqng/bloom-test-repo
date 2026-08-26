// bloom-deps:

export function buildPaginatedResponse<T>(
  items: unknown,
  totalCount: unknown,
  page: unknown,
  pageSize: unknown
): {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  if (
    typeof totalCount !== "number" ||
    !Number.isFinite(totalCount) ||
    !Number.isInteger(totalCount) ||
    totalCount < 0
  ) {
    throw new TypeError("totalCount must be a non-negative integer");
  }

  if (
    typeof page !== "number" ||
    !Number.isFinite(page) ||
    !Number.isInteger(page) ||
    page <= 0
  ) {
    throw new TypeError("page must be a positive integer");
  }

  if (
    typeof pageSize !== "number" ||
    !Number.isFinite(pageSize) ||
    !Number.isInteger(pageSize) ||
    pageSize <= 0
  ) {
    throw new TypeError("pageSize must be a positive integer");
  }

  if (items.length > pageSize) {
    throw new RangeError("items.length must not exceed pageSize");
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (page > totalPages) {
    throw new RangeError("page must not exceed totalPages");
  }

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    items: items as T[],
    totalCount,
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}