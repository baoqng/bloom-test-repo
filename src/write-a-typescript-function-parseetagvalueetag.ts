// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseETagValue(etag: unknown): { weak: boolean; tag: string } {
  // Input validation guard: check type
  if (typeof etag !== 'string') {
    throw new TypeError('ETag must be a string');
  }

  // Check for empty string
  if (etag.length === 0) {
    throw new TypeError('ETag must not be empty');
  }

  // Check for wildcard value
  if (etag === '*') {
    throw new SyntaxError('Wildcard value "*" is not a valid ETag');
  }

  // Check for strong ETag pattern: "..."
  const strongETagPattern = /^"[^"]*"$/;
  if (strongETagPattern.test(etag)) {
    // Extract tag content between quotes
    const tag = etag.slice(1, -1);
    return { weak: false, tag };
  }

  // Check for weak ETag pattern: W/"..."
  const weakETagPattern = /^W\/"[^"]*"$/;
  if (weakETagPattern.test(etag)) {
    // Extract tag content between inner quotes (skip 'W/' prefix)
    const tag = etag.slice(3, -1);
    return { weak: true, tag };
  }

  // If neither pattern matches, throw SyntaxError
  throw new SyntaxError(`Invalid ETag format: ${etag}`);
}