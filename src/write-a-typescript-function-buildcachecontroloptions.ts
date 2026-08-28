// bloom-deps:

export function buildCacheControl(options: unknown): string {
  // Validate that options is a plain object
  if (
    options === null ||
    typeof options !== 'object' ||
    Array.isArray(options) ||
    Object.getPrototypeOf(options) !== Object.prototype
  ) {
    throw new TypeError('options must be a plain object');
  }

  const opts = options as Record<string, unknown>;

  // Validate field types
  const booleanFields = ['noCache', 'noStore', 'mustRevalidate', 'private', 'public'] as const;
  const numberFields = ['maxAge', 'sMaxAge'] as const;

  for (const field of booleanFields) {
    if (field in opts && typeof opts[field] !== 'boolean') {
      throw new TypeError(`options.${field} must be a boolean`);
    }
  }

  for (const field of numberFields) {
    if (field in opts && typeof opts[field] !== 'number') {
      throw new TypeError(`options.${field} must be a number`);
    }
  }

  // Validate number fields
  if ('maxAge' in opts) {
    const maxAge = opts['maxAge'] as number;
    if (!isFinite(maxAge)) {
      throw new RangeError('options.maxAge must be a finite number');
    }
    if (!Number.isInteger(maxAge)) {
      throw new RangeError('options.maxAge must be an integer');
    }
    if (maxAge < 0) {
      throw new RangeError('options.maxAge must be a non-negative integer');
    }
  }

  if ('sMaxAge' in opts) {
    const sMaxAge = opts['sMaxAge'] as number;
    if (!isFinite(sMaxAge)) {
      throw new RangeError('options.sMaxAge must be a finite number');
    }
    if (!Number.isInteger(sMaxAge)) {
      throw new RangeError('options.sMaxAge must be an integer');
    }
    if (sMaxAge < 0) {
      throw new RangeError('options.sMaxAge must be a non-negative integer');
    }
  }

  // Validate conflict between private and public
  if (opts['private'] === true && opts['public'] === true) {
    throw new RangeError('options.private and options.public cannot both be true');
  }

  // Assemble directives in specified order:
  // no-store, no-cache, private, public, must-revalidate, max-age=N, s-maxage=N
  const directives: string[] = [];

  if (opts['noStore'] === true) {
    directives.push('no-store');
  }

  if (opts['noCache'] === true) {
    directives.push('no-cache');
  }

  if (opts['private'] === true) {
    directives.push('private');
  }

  if (opts['public'] === true) {
    directives.push('public');
  }

  if (opts['mustRevalidate'] === true) {
    directives.push('must-revalidate');
  }

  if ('maxAge' in opts) {
    directives.push(`max-age=${opts['maxAge']}`);
  }

  if ('sMaxAge' in opts) {
    directives.push(`s-maxage=${opts['sMaxAge']}`);
  }

  return directives.join(', ');
}