// bloom-deps:

function isPlainObject(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  
  return Object.getPrototypeOf(obj) === Object.prototype;
}

function buildCorsHeaders(origin: unknown, config: unknown): Record<string, string> {
  // Validate origin
  if (typeof origin !== 'string' || origin.length === 0) {
    throw new TypeError('origin must be a non-empty string');
  }

  // Validate config
  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }

  const configObj = config as Record<string, unknown>;

  // Extract and validate config fields with defaults
  const allowedOrigins = Array.isArray(configObj.allowedOrigins)
    ? configObj.allowedOrigins
    : ['*'];
  
  const allowedMethods = Array.isArray(configObj.allowedMethods)
    ? configObj.allowedMethods
    : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  
  const allowedHeaders = Array.isArray(configObj.allowedHeaders)
    ? configObj.allowedHeaders
    : [];
  
  const allowCredentials = typeof configObj.allowCredentials === 'boolean'
    ? configObj.allowCredentials
    : false;
  
  const maxAge = typeof configObj.maxAge === 'number' && configObj.maxAge > 0
    ? configObj.maxAge
    : undefined;

  const result: Record<string, string> = {};

  // Determine the resolved allowed origin
  let resolvedOrigin: string | undefined;
  
  if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
    resolvedOrigin = '*';
  } else {
    // Check if origin matches any entry in allowedOrigins
    const matchedIndex = allowedOrigins.indexOf(origin);
    if (matchedIndex !== -1) {
      resolvedOrigin = origin;
    }
  }

  // Check wildcard with credentials constraint
  if (allowCredentials && resolvedOrigin === '*') {
    throw new RangeError('allowCredentials cannot be true when origin is wildcard');
  }

  // Add Access-Control-Allow-Origin header if resolved
  if (resolvedOrigin !== undefined) {
    result['Access-Control-Allow-Origin'] = resolvedOrigin;
  }

  // Add Access-Control-Allow-Methods header
  const methodsValue = allowedMethods.join(',');
  if (methodsValue.length > 0) {
    result['Access-Control-Allow-Methods'] = methodsValue;
  }

  // Add Access-Control-Allow-Headers header
  const headersValue = allowedHeaders.join(',');
  if (headersValue.length > 0) {
    result['Access-Control-Allow-Headers'] = headersValue;
  }

  // Add Access-Control-Allow-Credentials header
  if (allowCredentials) {
    result['Access-Control-Allow-Credentials'] = 'true';
  }

  // Add Access-Control-Max-Age header if maxAge is present
  if (maxAge !== undefined) {
    result['Access-Control-Max-Age'] = maxAge.toString();
  }

  return result;
}

export { buildCorsHeaders };