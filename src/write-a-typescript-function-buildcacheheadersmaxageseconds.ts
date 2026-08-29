// bloom-deps:

interface CacheHeaders {
  'Cache-Control'?: string;
  'ETag'?: string;
  'Last-Modified'?: string;
}

export function buildCacheHeaders(
  maxAgeSeconds: number,
  etag?: string,
  lastModified?: Date
): CacheHeaders {
  // Validate maxAgeSeconds type
  if (typeof maxAgeSeconds !== 'number') {
    throw new TypeError('maxAgeSeconds must be a number');
  }

  // Validate maxAgeSeconds is finite and non-negative
  if (!isFinite(maxAgeSeconds) || isNaN(maxAgeSeconds)) {
    throw new RangeError('maxAgeSeconds must be a finite number');
  }

  if (maxAgeSeconds < 0) {
    throw new RangeError('maxAgeSeconds must be non-negative');
  }

  // Validate etag if provided
  if (etag !== undefined) {
    if (typeof etag !== 'string') {
      throw new TypeError('etag must be a string');
    }
    if (etag.trim().length === 0) {
      throw new RangeError('etag must not be empty after trimming');
    }
  }

  // Validate lastModified if provided
  if (lastModified !== undefined) {
    if (!(lastModified instanceof Date)) {
      throw new TypeError('lastModified must be a Date');
    }
    if (isNaN(lastModified.getTime())) {
      throw new RangeError('lastModified must be a valid Date');
    }
  }

  const result: CacheHeaders = {
    'Cache-Control': `max-age=${maxAgeSeconds}`,
  };

  if (etag !== undefined) {
    result['ETag'] = `"${etag}"`;
  }

  if (lastModified !== undefined) {
    result['Last-Modified'] = lastModified.toUTCString();
  }

  return result;
}