// bloom-deps:

export function validatePaginationParams(page: unknown, limit: unknown): boolean {
  // Validate page: must be a positive integer >= 1
  if (typeof page !== 'number' || !Number.isInteger(page) || page < 1) {
    return false;
  }

  // Validate limit: must be an integer between 1 and 100 inclusive
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return false;
  }

  return true;
}