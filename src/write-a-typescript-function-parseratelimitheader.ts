// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = "ServiceError";
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseRateLimit(header: unknown): {
  limit: number;
  remaining: number;
  reset: number;
} {
  // Validate that header is a non-empty string
  if (typeof header !== "string") {
    throw new TypeError(
      "Rate limit header must be a non-empty string, got " + typeof header
    );
  }

  if (header.length === 0) {
    throw new TypeError("Rate limit header must be a non-empty string");
  }

  // Initialize result object with undefined to track missing fields
  const result: { limit?: number; remaining?: number; reset?: number } = {};

  // Split by comma and parse each field
  const fields = header.split(",");

  for (const field of fields) {
    const trimmed = field.trim();

    // Split by '=' with optional whitespace
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      throw new RangeError(
        `Invalid rate limit field format: "${trimmed}" (missing '=')`
      );
    }

    const key = trimmed.substring(0, eqIndex).trim();
    const valueStr = trimmed.substring(eqIndex + 1).trim();

    // Validate key is one of the expected fields
    if (!["limit", "remaining", "reset"].includes(key)) {
      throw new RangeError(`Unknown rate limit field: "${key}"`);
    }

    // Parse value as integer
    const value = parseInt(valueStr, 10);

    // Check if parsing was successful (parseInt returns NaN if it fails)
    if (isNaN(value) || valueStr !== value.toString()) {
      throw new RangeError(`Invalid integer value for "${key}": "${valueStr}"`);
    }

    // Check if value is negative
    if (value < 0) {
      throw new RangeError(
        `Rate limit field "${key}" cannot be negative: ${value}`
      );
    }

    result[key as keyof typeof result] = value;
  }

  // Verify all required fields are present
  if (result.limit === undefined) {
    throw new RangeError("Rate limit header missing required field: limit");
  }
  if (result.remaining === undefined) {
    throw new RangeError("Rate limit header missing required field: remaining");
  }
  if (result.reset === undefined) {
    throw new RangeError("Rate limit header missing required field: reset");
  }

  return {
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}