// bloom-deps:

function applyRateLimit(
  requestCount: unknown,
  windowMs: unknown,
  limitPerWindow: unknown
): boolean {
  // Validate requestCount
  if (
    typeof requestCount !== "number" ||
    !Number.isInteger(requestCount) ||
    requestCount < 0
  ) {
    throw new TypeError("requestCount must be a non-negative integer");
  }

  // Validate windowMs
  if (
    typeof windowMs !== "number" ||
    !Number.isInteger(windowMs) ||
    windowMs <= 0
  ) {
    throw new TypeError("windowMs must be a positive integer");
  }

  // Validate limitPerWindow
  if (
    typeof limitPerWindow !== "number" ||
    !Number.isInteger(limitPerWindow) ||
    limitPerWindow <= 0
  ) {
    throw new TypeError("limitPerWindow must be a positive integer");
  }

  // Return true if requestCount is within the limit, false otherwise
  return requestCount <= limitPerWindow;
}

export { applyRateLimit };