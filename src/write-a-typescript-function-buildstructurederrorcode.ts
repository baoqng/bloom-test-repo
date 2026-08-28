// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.getPrototypeOf(value) === Object.prototype;
}

export function buildStructuredError(
  code: unknown,
  message: unknown,
  details: unknown
): { error: { code: string; message: string; details: Record<string, unknown>; timestamp: string } } {
  if (typeof code !== 'string' || code.trim().length === 0) {
    throw new TypeError('code must be a non-empty string');
  }
  const trimmedCode = code.trim();

  if (/[^A-Z0-9_]/.test(trimmedCode)) {
    throw new RangeError('code must contain only uppercase letters, digits, and underscores');
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new TypeError('message must be a non-empty string');
  }
  const trimmedMessage = message.trim();

  let detailsOrEmpty: Record<string, unknown>;
  if (details === null) {
    detailsOrEmpty = {};
  } else if (!isPlainObject(details)) {
    throw new TypeError('details must be a plain object');
  } else {
    detailsOrEmpty = details as Record<string, unknown>;
  }

  const timestamp = new Date().toISOString();

  return {
    error: {
      code: trimmedCode,
      message: trimmedMessage,
      details: detailsOrEmpty,
      timestamp,
    },
  };
}