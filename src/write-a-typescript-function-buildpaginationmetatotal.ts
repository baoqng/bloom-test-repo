// bloom-deps:

function buildPaginationMeta(
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
  // Type validation: must be finite numbers
  if (
    typeof total !== "number" ||
    typeof limit !== "number" ||
    typeof offset !== "number" ||
    !Number.isFinite(total) ||
    !Number.isFinite(limit) ||
    !Number.isFinite(offset)
  ) {
    throw new TypeError("total, limit, and offset must all be finite numbers");
  }

  // Range validation: total must not be negative
  if (total < 0) {
    throw new RangeError("total must not be negative");
  }

  // Range validation: limit must be a positive integer
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new RangeError("limit must be a positive integer");
  }

  // Range validation: offset must not be negative
  if (offset < 0) {
    throw new RangeError("offset must not be negative");
  }

  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  const nextOffset = hasNext ? offset + limit : null;
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

export { buildPaginationMeta };