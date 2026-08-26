// bloom-deps:

export function buildStructuredError(
  code: unknown,
  message: unknown,
  details: unknown
): { error: { code: string; message: string; details: Record<string, unknown>; timestamp: string } } {
  // Validate code
  if (typeof code !== "string") {
    throw new TypeError("code must be a non-empty string");
  }

  const trimmedCode = code.trim();

  if (trimmedCode.length === 0) {
    throw new TypeError("code must be a non-empty string");
  }

  // Check code format: only uppercase letters, digits, and underscores
  if (!/^[A-Z0-9_]+$/.test(trimmedCode)) {
    throw new RangeError(
      "code must contain only uppercase letters, digits, and underscores"
    );
  }

  // Validate message
  if (typeof message !== "string") {
    throw new TypeError("message must be a non-empty string");
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    throw new TypeError("message must be a non-empty string");
  }

  // Validate details
  let detailsOrEmpty: Record<string, unknown>;

  if (details === null) {
    detailsOrEmpty = {};
  } else if (
    typeof details !== "object" ||
    Array.isArray(details) ||
    Object.getPrototypeOf(details) !== Object.prototype
  ) {
    throw new TypeError("details must be a plain object");
  } else {
    detailsOrEmpty = details as Record<string, unknown>;
  }

  // Get current UTC timestamp in ISO 8601 format
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