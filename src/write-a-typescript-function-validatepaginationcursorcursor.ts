// bloom-deps:

export function validatePaginationCursor(cursor: unknown): { page: number; pageSize: number; offset: number } {
  // Check if cursor is a string
  if (typeof cursor !== 'string') {
    throw new TypeError('Invalid cursor format');
  }

  // Check if cursor is empty
  if (cursor.length === 0) {
    throw new TypeError('Invalid cursor format');
  }

  // Check if cursor length is valid base64 (must be divisible by 4)
  if (cursor.length % 4 !== 0) {
    throw new TypeError('Invalid cursor format');
  }

  // Decode base64
  let decoded: string;
  try {
    decoded = Buffer.from(cursor, 'base64').toString('utf8');
  } catch {
    throw new TypeError('Invalid cursor format');
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new TypeError('Invalid cursor format');
  }

  // Verify it's a plain object with required fields
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    Array.isArray(parsed) ||
    Object.getPrototypeOf(parsed) !== Object.prototype
  ) {
    throw new TypeError('Invalid cursor format');
  }

  const obj = parsed as Record<string, unknown>;

  // Check for required fields
  if (!('page' in obj) || !('pageSize' in obj) || !('offset' in obj)) {
    throw new TypeError('Invalid cursor format');
  }

  const { page, pageSize, offset } = obj;

  // Validate page
  if (
    typeof page !== 'number' ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 10000
  ) {
    throw new TypeError('Invalid cursor format');
  }

  // Validate pageSize
  if (
    typeof pageSize !== 'number' ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 500
  ) {
    throw new TypeError('Invalid cursor format');
  }

  // Validate offset
  if (
    typeof offset !== 'number' ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    throw new TypeError('Invalid cursor format');
  }

  // Check offset invariant: offset must equal (page - 1) * pageSize
  const expectedOffset = (page - 1) * pageSize;
  if (offset !== expectedOffset) {
    throw new TypeError('Invalid cursor format');
  }

  return { page, pageSize, offset };
}