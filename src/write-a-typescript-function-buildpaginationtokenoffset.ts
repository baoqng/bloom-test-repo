// bloom-deps:

function buildPaginationToken(offset: unknown, limit: unknown, total: unknown): string | null {
  if (typeof offset !== 'number') throw new TypeError('offset must be a number');
  if (typeof limit !== 'number') throw new TypeError('limit must be a number');
  if (typeof total !== 'number') throw new TypeError('total must be a number');

  if (!Number.isFinite(offset) || !Number.isInteger(offset) || offset < 0) {
    throw new RangeError('offset must be a non-negative integer');
  }
  if (!Number.isFinite(limit) || !Number.isInteger(limit) || limit <= 0) {
    throw new RangeError('limit must be a positive integer');
  }
  if (!Number.isFinite(total) || !Number.isInteger(total) || total < 0) {
    throw new RangeError('total must be a non-negative integer');
  }

  if (offset + limit >= total) {
    return null;
  }

  const next = offset + limit;
  const json = JSON.stringify({ next, limit });
  const base64 = Buffer.from(json, 'utf8').toString('base64');
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64url;
}

export { buildPaginationToken };