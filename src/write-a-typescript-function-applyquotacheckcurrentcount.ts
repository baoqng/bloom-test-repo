// bloom-deps:

export function applyQuotaCheck(
  currentCount: unknown,
  limit: unknown,
  windowUsedMs: unknown,
  windowMs: unknown
): { allowed: boolean; remaining: number; resetAfterMs: number } {
  if (
    typeof currentCount !== "number" ||
    !Number.isFinite(currentCount) ||
    !Number.isInteger(currentCount) ||
    currentCount < 0
  ) {
    throw new TypeError("currentCount must be a non-negative integer");
  }

  if (
    typeof limit !== "number" ||
    !Number.isFinite(limit) ||
    !Number.isInteger(limit) ||
    limit <= 0
  ) {
    throw new TypeError("limit must be a positive integer");
  }

  if (
    typeof windowUsedMs !== "number" ||
    !Number.isFinite(windowUsedMs) ||
    !Number.isInteger(windowUsedMs) ||
    windowUsedMs < 0
  ) {
    throw new TypeError("windowUsedMs must be a non-negative integer");
  }

  if (
    typeof windowMs !== "number" ||
    !Number.isFinite(windowMs) ||
    !Number.isInteger(windowMs) ||
    windowMs <= 0
  ) {
    throw new TypeError("windowMs must be a positive integer");
  }

  if (windowUsedMs > windowMs) {
    throw new RangeError("windowUsedMs must not exceed windowMs");
  }

  const allowed = currentCount < limit;
  const remaining = allowed ? Math.max(0, limit - currentCount) : 0;
  const resetAfterMs = windowMs - windowUsedMs;

  return { allowed, remaining, resetAfterMs };
}