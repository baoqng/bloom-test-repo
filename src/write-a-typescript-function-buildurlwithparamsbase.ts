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

export function buildURLWithParams(base: unknown, params: unknown): string {
  // Input validation guard - REQUIRED
  if (typeof base !== 'string') {
    throw new TypeError('base must be a non-empty string');
  }

  if (base.length === 0) {
    throw new TypeError('base must be a non-empty string');
  }

  if (params === null || typeof params !== 'object' || Array.isArray(params)) {
    throw new TypeError('params must be a plain non-null object');
  }

  // Check if params is a plain object (not a class instance)
  if (Object.getPrototypeOf(params) !== Object.prototype) {
    throw new TypeError('params must be a plain non-null object');
  }

  // Validate base is a valid absolute URL
  let baseUrl: URL;
  try {
    baseUrl = new URL(base);
  } catch {
    throw new RangeError('base must be a valid absolute URL');
  }

  // Validate each param key-value pair
  const validParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    // Omit undefined values
    if (value === undefined) {
      continue;
    }

    // Validate value type
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      throw new TypeError(`param value must be a string, number, or boolean, got ${typeof value}`);
    }

    // For numbers, validate they are finite
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new RangeError('param value must be a finite number');
      }
    }

    // Encode key and value
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(String(value));

    validParams[encodedKey] = encodedValue;
  }

  // Build query string from validated params
  const queryPairs = Object.entries(validParams).map(([key, value]) => `${key}=${value}`);
  const newQueryString = queryPairs.join('&');

  // Append to existing query string or replace
  if (newQueryString.length === 0) {
    return baseUrl.toString();
  }

  const separator = baseUrl.search ? '&' : '?';
  return `${baseUrl.toString()}${separator}${newQueryString}`;
}