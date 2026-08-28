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
  if (
    typeof total !== 'number' || !isFinite(total) ||
    typeof limit !== 'number' || !isFinite(limit) ||
    typeof offset !== 'number' || !isFinite(offset)
  ) {
    throw new TypeError('All arguments must be finite numbers');
  }

  if (total < 0) {
    throw new RangeError('total must not be negative');
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer');
  }

  if (offset < 0) {
    throw new RangeError('offset must not be negative');
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