// bloom-deps:

function encodePaginationCursor(id: unknown, createdAt: unknown): string {
  if (typeof id !== 'string' || id.length === 0) {
    throw new TypeError('id must be a non-empty string');
  }

  if (typeof createdAt !== 'number' || !Number.isFinite(createdAt)) {
    throw new TypeError('createdAt must be a finite number');
  }

  if (createdAt < 0 || !Number.isInteger(createdAt)) {
    throw new RangeError('createdAt must be a non-negative integer');
  }

  const json = `{"id":"${id}","ts":${createdAt}}`;

  const base64 = Buffer.from(json, 'utf8').toString('base64');
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return base64url;
}

export { encodePaginationCursor };