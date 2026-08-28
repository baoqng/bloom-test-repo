// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  // value with null prototype is also plain
  return Object.getPrototypeOf(value) === null || false;
}

function isPlainObjectStrict(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  if (proto === Object.prototype) return true;
  // Walk the full prototype chain to detect class instances
  let p = proto;
  while (p !== null) {
    if (p === Object.prototype) {
      // Check if the direct prototype is Object.prototype (plain object)
      // or something else (class instance)
      break;
    }
    p = Object.getPrototypeOf(p);
  }
  // If proto is exactly Object.prototype or null, it's plain
  return proto === Object.prototype || proto === null;
}

export function formatLogEntry(level: unknown, message: unknown, context: unknown): string {
  // Validate level type
  if (typeof level !== 'string') {
    throw new TypeError('level must be a string');
  }

  // Normalize level
  const normalizedLevel = level.trim().toLowerCase();

  // Validate level value
  const validLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLevels.includes(normalizedLevel)) {
    throw new RangeError('level must be one of: debug, info, warn, error');
  }

  // Validate message
  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new TypeError('message must be a non-empty string');
  }
  const normalizedMessage = message.trim();

  // Validate context
  if (context !== null) {
    if (typeof context !== 'object' || Array.isArray(context)) {
      throw new TypeError('context must be a plain object or null');
    }
    // Check for class instances by walking prototype chain
    const proto = Object.getPrototypeOf(context);
    if (proto !== null && proto !== Object.prototype) {
      throw new TypeError('context must be a plain object or null');
    }
  }

  // Build log entry
  const timestamp = new Date().toISOString();

  // Start with context properties (if not null), then override with required fields
  const contextProps: Record<string, unknown> = {};
  if (context !== null) {
    const ctx = context as Record<string, unknown>;
    for (const key of Object.keys(ctx)) {
      // Only spread own enumerable properties that don't collide
      if (key !== 'level' && key !== 'message' && key !== 'timestamp') {
        contextProps[key] = ctx[key];
      }
    }
  }

  const logEntry: Record<string, unknown> = {
    level: normalizedLevel,
    message: normalizedMessage,
    timestamp,
    ...contextProps,
  };

  return JSON.stringify(logEntry);
}