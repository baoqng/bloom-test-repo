// bloom-deps:

export function buildPaginationMeta(
  total: unknown,
  limit: unknown,
  offset: unknown
): {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextOffset: number | null;
  prevOffset: number | null;
} {
  // Validate that all arguments are finite numbers
  if (typeof total !== "number" || !Number.isFinite(total)) {
    throw new TypeError("total must be a finite number");
  }

  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    throw new TypeError("limit must be a finite number");
  }

  if (typeof offset !== "number" || !Number.isFinite(offset)) {
    throw new TypeError("offset must be a finite number");
  }

  // Validate business rules
  if (total < 0) {
    throw new RangeError("total must not be negative");
  }

  if (limit <= 0 || !Number.isInteger(limit)) {
    throw new RangeError("limit must be a positive integer");
  }

  if (offset < 0) {
    throw new RangeError("offset must not be negative");
  }

  // Compute pagination metadata
  const hasNext = offset + limit < total;
  const nextOffset = hasNext ? offset + limit : null;

  const hasPrev = offset > 0;
  const prevOffset = hasPrev ? Math.max(0, offset - limit) : null;

  return {
    total,
    limit,
    offset,
    hasNext,
    hasPrev,
    nextOffset,
    prevOffset,
  };
}