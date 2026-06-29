export function validatePaginationParams(page: unknown, pageSize: unknown): { offset: number; limit: number } {
  if (page === null || page === undefined) {
    throw new TypeError('page is required');
  }
  if (pageSize === null || pageSize === undefined) {
    throw new TypeError('pageSize is required');
  }
  if (typeof page !== 'number') {
    throw new TypeError('page must be a number');
  }
  if (typeof pageSize !== 'number') {
    throw new TypeError('pageSize must be a number');
  }
  if (Number.isNaN(page) || page < 1) {
    throw new RangeError('page must be at least 1');
  }
  if (Number.isNaN(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize must be at least 1');
  }
  if (pageSize > 100) {
    throw new RangeError('pageSize cannot exceed 100');
  }
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}