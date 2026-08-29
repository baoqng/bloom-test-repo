// bloom-deps:

function buildProblemDetails(
  status: unknown,
  title: unknown,
  detail: unknown,
  extensions: unknown
): Record<string, unknown> {
  // Validate status: must be an integer in [100, 599]
  if (!Number.isInteger(status) || typeof status !== 'number' || status < 100 || status > 599) {
    throw new TypeError('status must be an integer between 100 and 599');
  }

  // Validate title: must be a non-empty string
  if (typeof title !== 'string' || title.length === 0) {
    throw new TypeError('title must be a non-empty string');
  }

  // Validate detail: must be a string or null
  if (detail !== null && typeof detail !== 'string') {
    throw new TypeError('detail must be a string or null');
  }

  // Validate extensions: must be a plain object
  if (!isPlainObject(extensions)) {
    throw new TypeError('extensions must be a plain object');
  }

  // Check for reserved field conflicts in extensions
  const reserved = new Set(['type', 'status', 'title', 'detail']);
  for (const key in extensions) {
    if (Object.prototype.hasOwnProperty.call(extensions, key)) {
      if (reserved.has(key)) {
        throw new RangeError('Extension key conflicts with reserved field');
      }
    }
  }

  // Build the result object
  const result: Record<string, unknown> = {
    type: 'about:blank',
    status,
    title,
  };

  // Add detail only if not null
  if (detail !== null) {
    result.detail = detail;
  }

  // Spread extension fields at the end
  for (const key in extensions) {
    if (Object.prototype.hasOwnProperty.call(extensions, key)) {
      result[key] = (extensions as Record<string, unknown>)[key];
    }
  }

  return result;
}

/**
 * Check if a value is a plain object (not null, not array, prototype is Object.prototype).
 * Walk the full prototype chain to ensure it's truly a plain object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  // Rule 1: null + typeof check
  if (value === null || typeof value !== 'object') {
    return false;
  }

  // Rule 2: Array check
  if (Array.isArray(value)) {
    return false;
  }

  // Rule 3: Direct prototype check
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype) {
    return false;
  }

  return true;
}

export { buildProblemDetails };