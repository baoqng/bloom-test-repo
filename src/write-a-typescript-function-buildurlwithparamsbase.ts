// bloom-deps:

export function buildURLWithParams(base: unknown, params: unknown): string {
  // Validate base is a non-empty string
  if (typeof base !== 'string' || base.trim().length === 0) {
    throw new TypeError('base must be a non-empty string');
  }

  // Validate base is a valid absolute URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(base);
  } catch {
    throw new RangeError(`base is not a valid absolute URL: ${base}`);
  }

  // Validate params is a plain non-null object
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain non-null object');
  }

  const paramsObj = params as Record<string, unknown>;

  // Validate each param value
  for (const key of Object.keys(paramsObj)) {
    const value = paramsObj[key];

    // Omit undefined values
    if (value === undefined) {
      continue;
    }

    // Validate value type
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      throw new TypeError(`param value for key "${key}" must be a string, number, or boolean`);
    }

    // Validate finite for numbers
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new RangeError(`param value for key "${key}" must be a finite number`);
    }
  }

  // Build query string pairs
  const pairs: string[] = [];
  for (const key of Object.keys(paramsObj)) {
    const value = paramsObj[key];

    // Omit undefined values
    if (value === undefined) {
      continue;
    }

    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  if (pairs.length === 0) {
    return base;
  }

  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}${pairs.join('&')}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}