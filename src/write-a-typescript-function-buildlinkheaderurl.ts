// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function buildLinkHeader(url: unknown, rel: unknown, params: unknown): string {
  // Validate url
  if (typeof url !== 'string' || url.trim() === '') {
    throw new TypeError('url must be a non-empty string');
  }
  const trimmedUrl = url.trim();
  try {
    new URL(trimmedUrl);
  } catch {
    throw new RangeError('url is not a valid absolute URL');
  }

  // Validate rel
  if (typeof rel !== 'string' || rel.trim() === '') {
    throw new TypeError('rel must be a non-empty string');
  }
  const trimmedRel = rel.trim();
  if (/[^a-zA-Z0-9\-.]/.test(trimmedRel)) {
    throw new RangeError('rel must contain only letters, digits, hyphens, and dots');
  }

  // Validate params
  if (params !== null) {
    if (typeof params !== 'object' || Array.isArray(params) || !isPlainObject(params)) {
      throw new TypeError('params must be a plain object or null');
    }
    const paramsObj = params as Record<string, unknown>;
    for (const key of Object.keys(paramsObj)) {
      if (typeof paramsObj[key] !== 'string') {
        throw new TypeError('all param values must be strings');
      }
    }
  }

  // Build base link
  let result = `<${trimmedUrl}>; rel="${trimmedRel}"`;

  // Append params sorted lexicographically
  if (params !== null) {
    const paramsObj = params as Record<string, string>;
    const sortedKeys = Object.keys(paramsObj).sort();
    for (const key of sortedKeys) {
      result += `; ${key}="${paramsObj[key]}"`;
    }
  }

  return result;
}