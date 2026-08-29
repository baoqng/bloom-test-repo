// bloom-deps:

function computePageSlice(
  totalItems: unknown,
  page: unknown,
  pageSize: unknown
): { offset: number; limit: number; totalPages: number; isEmpty: boolean } {
  if (
    typeof totalItems !== 'number' ||
    !Number.isFinite(totalItems) ||
    !Number.isInteger(totalItems) ||
    totalItems < 0
  ) {
    throw new TypeError('totalItems must be a non-negative integer');
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

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const offset = (page - 1) * pageSize;
  const limit = Math.min(pageSize, Math.max(0, totalItems - offset));
  const isEmpty = limit === 0;

  return { offset, limit, totalPages, isEmpty };
}

export { computePageSlice };