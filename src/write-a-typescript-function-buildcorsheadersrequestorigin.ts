// bloom-deps:

const VALID_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);

function buildCORSHeaders(
  requestOrigin: unknown,
  allowedOrigins: unknown,
  allowedMethods: unknown
): Record<string, string> | null {
  // Validate requestOrigin
  if (typeof requestOrigin !== 'string' || requestOrigin.length === 0) {
    throw new TypeError('requestOrigin must be a non-empty string');
  }

  // Validate allowedOrigins
  if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
    throw new TypeError('allowedOrigins must be a non-empty array of non-empty strings');
  }
  for (const origin of allowedOrigins) {
    if (typeof origin !== 'string' || origin.length === 0) {
      throw new TypeError('allowedOrigins must be a non-empty array of non-empty strings');
    }
  }

  // Validate allowedMethods type
  if (!Array.isArray(allowedMethods) || allowedMethods.length === 0) {
    throw new TypeError('allowedMethods must be a non-empty array of non-empty strings');
  }
  for (const method of allowedMethods) {
    if (typeof method !== 'string' || method.length === 0) {
      throw new TypeError('allowedMethods must be a non-empty array of non-empty strings');
    }
  }

  // Validate allowedMethods values
  for (const method of allowedMethods) {
    if (!VALID_METHODS.has(method)) {
      throw new RangeError(
        `allowedMethods contains invalid HTTP method: "${method}". Must be one of: ${[...VALID_METHODS].join(', ')}`
      );
    }
  }

  // Check if requestOrigin is in allowedOrigins (case-sensitive exact match)
  let found = false;
  for (const origin of allowedOrigins) {
    if (origin === requestOrigin) {
      found = true;
      break;
    }
  }

  if (!found) {
    return null;
  }

  return {
    'Access-Control-Allow-Origin': requestOrigin,
    'Access-Control-Allow-Methods': (allowedMethods as string[]).join(', '),
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

export { buildCORSHeaders };