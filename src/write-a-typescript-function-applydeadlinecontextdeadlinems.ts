// bloom-deps:

export function applyDeadlineContext(
  deadlineMs: unknown,
  nowMs: unknown,
  minRemainingMs: unknown
): { isExpired: boolean; remainingMs: number; isUrgent: boolean } {
  if (
    typeof deadlineMs !== "number" ||
    !Number.isFinite(deadlineMs) ||
    !Number.isInteger(deadlineMs) ||
    deadlineMs <= 0
  ) {
    throw new TypeError("deadlineMs must be a positive integer");
  }

  if (
    typeof nowMs !== "number" ||
    !Number.isFinite(nowMs) ||
    !Number.isInteger(nowMs) ||
    nowMs < 0
  ) {
    throw new TypeError("nowMs must be a non-negative integer");
  }

  if (
    typeof minRemainingMs !== "number" ||
    !Number.isFinite(minRemainingMs) ||
    !Number.isInteger(minRemainingMs) ||
    minRemainingMs <= 0
  ) {
    throw new TypeError("minRemainingMs must be a positive integer");
  }

  const remainingMs = Math.max(0, deadlineMs - nowMs);
  const isExpired = remainingMs === 0;
  const isUrgent = !isExpired && remainingMs <= minRemainingMs;

  return { isExpired, remainingMs, isUrgent };
}