// bloom-deps:

function buildCacheControlHeader(options: unknown): string {
  // Validate that options is a plain object (not null, not an array, typeof === 'object')
  if (typeof options !== 'object' || options === null || Array.isArray(options)) {
    throw new TypeError('options must be a plain object');
  }

  const opts = options as Record<string, unknown>;

  // Validate maxAge if present
  if ('maxAge' in opts) {
    const maxAge = opts.maxAge;
    if (
      typeof maxAge !== 'number' ||
      !Number.isFinite(maxAge) ||
      maxAge < 0 ||
      !Number.isInteger(maxAge)
    ) {
      throw new RangeError('maxAge must be a non-negative finite integer');
    }
  }

  // Validate staleWhileRevalidate if present
  if ('staleWhileRevalidate' in opts) {
    const swr = opts.staleWhileRevalidate;
    if (
      typeof swr !== 'number' ||
      !Number.isFinite(swr) ||
      swr < 0 ||
      !Number.isInteger(swr)
    ) {
      throw new RangeError(
        'staleWhileRevalidate must be a non-negative finite integer'
      );
    }
  }

  // Validate private if present
  if ('private' in opts && typeof opts.private !== 'boolean') {
    throw new TypeError('private must be a boolean');
  }

  // Validate noCache if present
  if ('noCache' in opts && typeof opts.noCache !== 'boolean') {
    throw new TypeError('noCache must be a boolean');
  }

  // Validate noStore if present
  if ('noStore' in opts && typeof opts.noStore !== 'boolean') {
    throw new TypeError('noStore must be a boolean');
  }

  const directives: string[] = [];

  // Emit directives in order: private, no-cache, no-store, max-age=N, stale-while-revalidate=N
  if (opts.private === true) {
    directives.push('private');
  }

  if (opts.noCache === true) {
    directives.push('no-cache');
  }

  if (opts.noStore === true) {
    directives.push('no-store');
  }

  if ('maxAge' in opts && typeof opts.maxAge === 'number') {
    directives.push(`max-age=${opts.maxAge}`);
  }

  if ('staleWhileRevalidate' in opts && typeof opts.staleWhileRevalidate === 'number') {
    directives.push(`stale-while-revalidate=${opts.staleWhileRevalidate}`);
  }

  return directives.join(', ');
}

export { buildCacheControlHeader };