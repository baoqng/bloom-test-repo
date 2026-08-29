// bloom-deps:

export interface CacheHeaders {
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

  // Validate maxAgeSeconds value (non-finite includes NaN, Infinity, -Infinity)
  if (!isFinite(maxAgeSeconds)) {
    throw new RangeError('maxAgeSeconds must be a finite number');
  }

  // Validate maxAgeSeconds is not negative
  if (maxAgeSeconds < 0) {
    throw new RangeError('maxAgeSeconds must not be negative');
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

  const headers: CacheHeaders = {
    'Cache-Control': `max-age=${maxAgeSeconds}`,
  };

  if (etag !== undefined) {
    headers['ETag'] = `"${etag}"`;
  }

  if (lastModified !== undefined) {
    headers['Last-Modified'] = lastModified.toUTCString();
  }

  return headers;
}