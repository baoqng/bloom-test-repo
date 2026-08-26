// bloom-deps:

export function applyRetentionPolicy(
  createdAtMs: unknown,
  retentionDays: unknown,
  nowMs: unknown
): { shouldDelete: boolean; expiresAtMs: number; daysRemaining: number } {
  if (
    typeof createdAtMs !== "number" ||
    !Number.isFinite(createdAtMs) ||
    !Number.isInteger(createdAtMs) ||
    createdAtMs < 0
  ) {
    throw new TypeError("createdAtMs must be a non-negative integer");
  }

  if (
    typeof retentionDays !== "number" ||
    !Number.isFinite(retentionDays) ||
    !Number.isInteger(retentionDays) ||
    retentionDays <= 0
  ) {
    throw new TypeError("retentionDays must be a positive integer");
  }

  if (
    typeof nowMs !== "number" ||
    !Number.isFinite(nowMs) ||
    !Number.isInteger(nowMs) ||
    nowMs < 0
  ) {
    throw new TypeError("nowMs must be a non-negative integer");
  }

  if (nowMs < createdAtMs) {
    throw new RangeError("nowMs must not be before createdAtMs");
  }

  const expiresAtMs = createdAtMs + retentionDays * 24 * 60 * 60 * 1000;
  const daysRemaining = Math.max(
    0,
    Math.ceil((expiresAtMs - nowMs) / (24 * 60 * 60 * 1000))
  );
  const shouldDelete = nowMs >= expiresAtMs;

  return { shouldDelete, expiresAtMs, daysRemaining };
}