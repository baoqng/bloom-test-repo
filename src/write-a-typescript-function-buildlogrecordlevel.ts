// bloom-deps:

function buildLogRecord(
  level: unknown,
  message: unknown,
  context: unknown
): { level: string; message: string; timestamp: string; context: Record<string, unknown> } {
  if (typeof level !== "string") {
    throw new TypeError("level must be a string");
  }

  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  if (!validLevels.includes(level)) {
    throw new SyntaxError("level must be one of: debug, info, warn, error, fatal");
  }

  if (typeof message !== "string" || message.trim() === "") {
    throw new TypeError("message must be a non-empty string");
  }

  if (context !== null) {
    if (
      typeof context !== "object" ||
      Array.isArray(context) ||
      Object.getPrototypeOf(context) !== Object.prototype
    ) {
      throw new TypeError("context must be a plain object or null");
    }
  }

  return {
    level,
    message: message.trim(),
    timestamp: new Date().toISOString(),
    context: (context ?? {}) as Record<string, unknown>,
  };
}

export { buildLogRecord };