// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  while (proto !== null) {
    if (
      proto.constructor !== undefined &&
      typeof proto.constructor === 'function' &&
      proto.constructor !== Object
    ) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function buildURLWithParams(base: unknown, params: unknown): string {
  // Validate base: must be a non-empty string
  if (typeof base !== 'string' || base.length === 0) {
    throw new TypeError('base must be a non-empty string');
  }

  // Validate params: must be a plain non-null object
  if (!isPlainObject(params)) {
    throw new TypeError('params must be a plain non-null object');
  }

  // Validate base is a valid absolute URL
  let parsedURL: URL;
  try {
    parsedURL = new URL(base);
  } catch {
    throw new RangeError('base must be a valid absolute URL');
  }

  const paramsObj = params as Record<string, unknown>;

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

    // For numbers, validate finiteness
    if (typeof value === 'number' && !isFinite(value)) {
      throw new RangeError(`param value for key "${key}" must be a finite number`);
    }

    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(String(value));

    if (parsedURL.search === '') {
      parsedURL.search = `?${encodedKey}=${encodedValue}`;
    } else {
      parsedURL.search = `${parsedURL.search}&${encodedKey}=${encodedValue}`;
    }
  }

  return parsedURL.toString();
}