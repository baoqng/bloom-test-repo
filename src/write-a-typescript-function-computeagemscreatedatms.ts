// bloom-deps:

export function computeAgeMs(
  createdAtMs: unknown,
  nowMs: unknown
): {
  ageMs: number;
  ageSeconds: number;
  ageMinutes: number;
  ageHours: number;
  ageDays: number;
} {
  if (
    typeof createdAtMs !== 'number' ||
    !Number.isFinite(createdAtMs) ||
    !Number.isInteger(createdAtMs) ||
    createdAtMs < 0
  ) {
    throw new TypeError('createdAtMs must be a non-negative integer');
  }

  if (
    typeof nowMs !== 'number' ||
    !Number.isFinite(nowMs) ||
    !Number.isInteger(nowMs) ||
    nowMs < 0
  ) {
    throw new TypeError('nowMs must be a non-negative integer');
  }

  if (nowMs < createdAtMs) {
    throw new RangeError('nowMs must not be before createdAtMs');
  }

  const ageMs = nowMs - createdAtMs;
  const ageSeconds = Math.floor(ageMs / 1000);
  const ageMinutes = Math.floor(ageMs / 60000);
  const ageHours = Math.floor(ageMs / 3600000);
  const ageDays = Math.floor(ageMs / 86400000);

  return { ageMs, ageSeconds, ageMinutes, ageHours, ageDays };
}