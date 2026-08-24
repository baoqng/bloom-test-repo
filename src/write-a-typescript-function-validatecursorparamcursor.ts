// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function validateCursorParam(
  cursor: unknown,
  limit: unknown
): { cursor: string | null; limit: number } {
  // Validate limit first (type check before any arithmetic)
  if (typeof limit !== 'number') {
    throw new TypeError(
      `limit must be of type 'number', received ${typeof limit}`
    );
  }

  if (Number.isNaN(limit)) {
    throw new TypeError('limit cannot be NaN');
  }

  if (!Number.isFinite(limit)) {
    throw new TypeError('limit must be finite');
  }

  if (Math.floor(limit) !== limit) {
    throw new RangeError('limit must be an integer');
  }

  if (limit < 1 || limit > 100) {
    throw new RangeError('limit must be between 1 and 100 inclusive');
  }

  // Validate cursor
  if (cursor === null || cursor === undefined) {
    return { cursor: null, limit };
  }

  if (typeof cursor !== 'string') {
    throw new TypeError(
      `cursor must be null, undefined, or a non-empty string, received ${typeof cursor}`
    );
  }

  if (cursor.length === 0) {
    throw new TypeError('cursor must be a non-empty string');
  }

  return { cursor, limit };
}