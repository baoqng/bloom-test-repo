// bloom-deps:

export function validateSortDirection(value: unknown): 'asc' | 'desc' {
  if (typeof value !== 'string') {
    throw new TypeError("Sort direction must be a string");
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'asc' || normalized === 'ascending') {
    return 'asc';
  }

  if (normalized === 'desc' || normalized === 'descending') {
    return 'desc';
  }

  throw new SyntaxError("Sort direction must be 'asc' or 'desc'");
}