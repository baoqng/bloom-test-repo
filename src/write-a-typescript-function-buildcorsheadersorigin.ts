// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype;
}

function buildCorsHeaders(origin: unknown, config: unknown): Record<string, string> {
  if (typeof origin !== 'string' || origin.length === 0) {
    throw new TypeError('origin must be a non-empty string');
  }

  if (!isPlainObject(config)) {
    throw new TypeError('config must be a plain object');
  }

  const configObj = config as Record<string, unknown>;

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

  const headers: Record<string, string> = {};

  let resolvedOrigin: string | undefined;

  if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
    resolvedOrigin = '*';
  } else {
    for (const allowed of allowedOrigins) {
      if (allowed === origin) {
        resolvedOrigin = origin;
        break;
      }
    }
  }

  if (resolvedOrigin === '*' && allowCredentials) {
    throw new RangeError('allowCredentials cannot be true when origin is wildcard');
  }

  if (resolvedOrigin) {
    headers['Access-Control-Allow-Origin'] = resolvedOrigin;
  }

  const methodsValue = allowedMethods.join(',');
  if (methodsValue.length > 0) {
    headers['Access-Control-Allow-Methods'] = methodsValue;
  }

  const headersValue = allowedHeaders.join(',');
  if (headersValue.length > 0) {
    headers['Access-Control-Allow-Headers'] = headersValue;
  }

  if (allowCredentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  if (maxAge !== undefined) {
    headers['Access-Control-Max-Age'] = String(maxAge);
  }

  return headers;
}

export { buildCorsHeaders };