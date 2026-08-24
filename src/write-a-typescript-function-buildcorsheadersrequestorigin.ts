// bloom-deps:

function buildCORSHeaders(
  requestOrigin: unknown,
  allowedOrigins: unknown,
  allowedMethods: unknown
): Record<string, string> | null {
  // Validate requestOrigin
  if (typeof requestOrigin !== "string" || requestOrigin.length === 0) {
    throw new TypeError("requestOrigin must be a non-empty string");
  }

  // Validate allowedOrigins
  if (
    !Array.isArray(allowedOrigins) ||
    allowedOrigins.length === 0 ||
    !allowedOrigins.every(
      (origin) => typeof origin === "string" && origin.length > 0
    )
  ) {
    throw new TypeError(
      "allowedOrigins must be a non-empty array of non-empty strings"
    );
  }

  // Validate allowedMethods
  if (
    !Array.isArray(allowedMethods) ||
    allowedMethods.length === 0 ||
    !allowedMethods.every(
      (method) => typeof method === "string" && method.length > 0
    )
  ) {
    throw new TypeError(
      "allowedMethods must be a non-empty array of non-empty strings"
    );
  }

  // Validate that each method is one of the permitted HTTP methods
  const permittedMethods = new Set([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
  ]);

  for (const method of allowedMethods) {
    if (!permittedMethods.has(method)) {
      throw new RangeError(
        `allowedMethods must only contain: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS. Got: ${method}`
      );
    }
  }

  // Check if requestOrigin is in allowedOrigins (case-sensitive exact match)
  if (!allowedOrigins.includes(requestOrigin)) {
    return null;
  }

  // Build and return CORS headers
  return {
    "Access-Control-Allow-Origin": requestOrigin,
    "Access-Control-Allow-Methods": allowedMethods.join(", "),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export { buildCORSHeaders };