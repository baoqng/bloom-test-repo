// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  // If we never hit Object.prototype, it's not a plain object
  // But actually for plain objects created with {} or new Object(), 
  // the prototype chain is: value -> Object.prototype -> null
  // So we need to check if direct prototype is Object.prototype or null
  return false;
}

// Revised: a plain object has Object.prototype as its direct prototype (or null for Object.create(null))
function isPlainObjectStrict(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  const proto = Object.getPrototypeOf(value);
  // Walk the full prototype chain to confirm it only goes through Object.prototype
  if (proto === null) return true; // Object.create(null)
  if (proto !== Object.prototype) return false;
  // Confirm no further exotic prototype
  const grandProto = Object.getPrototypeOf(proto);
  return grandProto === null;
}

export function buildCorsHeaders(origin: unknown, config: unknown): Record<string, string> {
  // Validate origin
  if (typeof origin !== 'string' || origin.length === 0) {
    throw new TypeError('origin must be a non-empty string');
  }

  // Validate config
  if (!isPlainObjectStrict(config)) {
    throw new TypeError('config must be a plain object');
  }

  const cfg = config as Record<string, unknown>;

  // Extract and default config fields
  const allowedOrigins: string[] = Array.isArray(cfg['allowedOrigins'])
    ? (cfg['allowedOrigins'] as string[])
    : ['*'];

  const allowedMethods: string[] = Array.isArray(cfg['allowedMethods'])
    ? (cfg['allowedMethods'] as string[])
    : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

  const allowedHeaders: string[] = Array.isArray(cfg['allowedHeaders'])
    ? (cfg['allowedHeaders'] as string[])
    : [];

  const allowCredentials: boolean = typeof cfg['allowCredentials'] === 'boolean'
    ? cfg['allowCredentials']
    : false;

  const maxAge: number | undefined = typeof cfg['maxAge'] === 'number' && cfg['maxAge'] > 0 && Number.isInteger(cfg['maxAge'])
    ? cfg['maxAge']
    : undefined;

  // Determine Access-Control-Allow-Origin
  let resolvedOrigin: string | undefined;

  if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
    resolvedOrigin = '*';
  } else {
    // Check if origin matches any entry
    const matched = allowedOrigins.find(o => o === origin);
    if (matched !== undefined) {
      resolvedOrigin = matched;
    } else {
      resolvedOrigin = undefined;
    }
  }

  // Check wildcard + credentials conflict
  if (allowCredentials && resolvedOrigin === '*') {
    throw new RangeError('allowCredentials cannot be true when origin is wildcard');
  }

  const headers: Record<string, string> = {};

  // Access-Control-Allow-Origin
  if (resolvedOrigin !== undefined) {
    headers['Access-Control-Allow-Origin'] = resolvedOrigin;
  }

  // Access-Control-Allow-Methods
  const methodsValue = allowedMethods.join(', ');
  if (methodsValue.length > 0) {
    headers['Access-Control-Allow-Methods'] = methodsValue;
  }

  // Access-Control-Allow-Headers
  const headersValue = allowedHeaders.join(', ');
  if (headersValue.length > 0) {
    headers['Access-Control-Allow-Headers'] = headersValue;
  }

  // Access-Control-Allow-Credentials
  if (allowCredentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  // Access-Control-Max-Age
  if (maxAge !== undefined) {
    headers['Access-Control-Max-Age'] = String(maxAge);
  }

  return headers;
}