// bloom-deps:

function buildPaginationToken(cursor: unknown, limit: unknown): string {
  if (typeof cursor !== 'string' || cursor.length === 0) {
    throw new TypeError('cursor must be a non-empty string');
  }

  if (
    typeof limit !== 'number' ||
    !Number.isInteger(limit) ||
    limit <= 0
  ) {
    throw new RangeError('limit must be a positive integer');
  }

  const payload = JSON.stringify({ cursor, limit });
  const base64 = Buffer.from(payload, 'utf8').toString('base64');
  const urlSafe = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return urlSafe;
}

export { buildPaginationToken };