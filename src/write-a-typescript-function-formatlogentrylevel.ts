// bloom-deps:

function formatLogEntry(level: unknown, message: unknown, context: unknown): string {
  // Validate level type
  if (typeof level !== 'string') {
    throw new TypeError('level must be a string');
  }

  // Validate level value
  const normalizedLevel = level.trim().toLowerCase();
  const validLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLevels.includes(normalizedLevel)) {
    throw new RangeError('level must be one of: debug, info, warn, error');
  }

  // Validate message
  if (typeof message !== 'string' || message.trim() === '') {
    throw new TypeError('message must be a non-empty string');
  }
  const normalizedMessage = message.trim();

  // Validate context
  if (context !== null) {
    if (
      typeof context !== 'object' ||
      Array.isArray(context) ||
      Object.getPrototypeOf(context) !== Object.prototype
    ) {
      throw new TypeError('context must be a plain object or null');
    }
  }

  // Build the log entry: spread context first, then override with level, message, timestamp
  const timestamp = new Date().toISOString();

  const contextProps: Record<string, unknown> = {};
  if (context !== null) {
    const ctx = context as Record<string, unknown>;
    for (const key of Object.keys(ctx)) {
      contextProps[key] = ctx[key];
    }
  }

  // context properties must not override level, message, or timestamp
  const logEntry: Record<string, unknown> = {
    ...contextProps,
    level: normalizedLevel,
    message: normalizedMessage,
    timestamp,
  };

  return JSON.stringify(logEntry);
}

export { formatLogEntry };