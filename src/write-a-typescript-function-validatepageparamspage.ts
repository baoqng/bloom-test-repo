// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function validatePageParams(
  page: unknown,
  pageSize: unknown,
  maxPageSize: number
): { page: number; pageSize: number } {
  // Validate maxPageSize first
  if (
    typeof maxPageSize !== 'number' ||
    !Number.isFinite(maxPageSize) ||
    !Number.isInteger(maxPageSize) ||
    maxPageSize <= 0
  ) {
    throw new TypeError(
      'maxPageSize must be a positive integer'
    );
  }

  // Validate page is a finite number
  if (typeof page !== 'number' || !Number.isFinite(page)) {
    throw new TypeError('page must be a finite number');
  }

  // Validate pageSize is a finite number
  if (typeof pageSize !== 'number' || !Number.isFinite(pageSize)) {
    throw new TypeError('pageSize must be a finite number');
  }

  // Validate page is an integer (no fractional part)
  if (!Number.isInteger(page)) {
    throw new RangeError('page must be an integer');
  }

  // Validate pageSize is an integer (no fractional part)
  if (!Number.isInteger(pageSize)) {
    throw new RangeError('pageSize must be an integer');
  }

  // Validate page is at least 1
  if (page < 1) {
    throw new RangeError('page must be greater than or equal to 1');
  }

  // Validate pageSize is at least 1
  if (pageSize < 1) {
    throw new RangeError('pageSize must be greater than or equal to 1');
  }

  // Validate pageSize does not exceed maxPageSize
  if (pageSize > maxPageSize) {
    throw new RangeError(
      `pageSize must be less than or equal to maxPageSize (${maxPageSize})`
    );
  }

  return {
    page,
    pageSize,
  };
}

export { validatePageParams, ServiceError };