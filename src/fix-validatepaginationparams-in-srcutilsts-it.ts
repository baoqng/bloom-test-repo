// bloom-deps:

export function validatePaginationParams(page: number, limit: number): boolean {
  if (!Number.isInteger(page) || page < 1) {
    return false;
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return false;
  }
  return true;
}