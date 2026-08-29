// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildStructuredLog(level: unknown, message: unknown, context: unknown): string {
  const validLevels = ['debug', 'info', 'warn', 'error'];
  if (typeof level !== 'string' || !validLevels.includes(level)) {
    throw new TypeError('level must be one of: debug, info, warn, error');
  }

  if (typeof message !== 'string' || message.length === 0) {
    throw new TypeError('message must be a non-empty string');
  }

  if (!isPlainObject(context)) {
    throw new TypeError('context must be a plain object');
  }

  const timestamp = new Date().toISOString();

  const contextObj = context as Record<string, unknown>;
  const spread: Record<string, unknown> = {};
  for (const key of Object.keys(contextObj)) {
    if (key !== 'level' && key !== 'message' && key !== 'timestamp') {
      spread[key] = contextObj[key];
    }
  }

  const log: Record<string, unknown> = {
    level,
    message,
    timestamp,
    ...spread,
  };

  return JSON.stringify(log) + '\n';
}