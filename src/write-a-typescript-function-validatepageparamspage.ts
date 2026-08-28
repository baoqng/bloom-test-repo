// bloom-deps:

function validatePageParams(page: unknown, pageSize: unknown, maxPageSize: number): { page: number; pageSize: number } {
  // Validate maxPageSize: must be a positive integer
  if (
    typeof maxPageSize !== "number" ||
    !Number.isFinite(maxPageSize) ||
    !Number.isInteger(maxPageSize) ||
    maxPageSize < 1
  ) {
    throw new TypeError("maxPageSize must be a positive integer");
  }

  // Validate page: must be a finite number
  if (typeof page !== "number" || !Number.isFinite(page)) {
    throw new TypeError("page must be a finite number");
  }

  // Validate pageSize: must be a finite number
  if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) {
    throw new TypeError("pageSize must be a finite number");
  }

  // Validate page >= 1
  if (page < 1) {
    throw new RangeError("page must be at least 1");
  }

  // Validate page is an integer
  if (!Number.isInteger(page)) {
    throw new RangeError("page must be an integer");
  }

  // Validate pageSize >= 1
  if (pageSize < 1) {
    throw new RangeError("pageSize must be at least 1");
  }

  // Validate pageSize is an integer
  if (!Number.isInteger(pageSize)) {
    throw new RangeError("pageSize must be an integer");
  }

  // Validate pageSize <= maxPageSize
  if (pageSize > maxPageSize) {
    throw new RangeError("pageSize must not exceed maxPageSize");
  }

  return { page: page as number, pageSize: pageSize as number };
}

export { validatePageParams };