// bloom-deps:

function computeSlidingWindowRate(
  eventTimestampsMs: unknown,
  windowMs: unknown,
  nowMs: unknown
): { count: number; ratePerSecond: number; oldestEventMs: number | null } {
  if (!Array.isArray(eventTimestampsMs)) {
    throw new TypeError("eventTimestampsMs must be an array");
  }

  for (const element of eventTimestampsMs) {
    if (
      typeof element !== "number" ||
      !Number.isFinite(element) ||
      !Number.isInteger(element) ||
      element < 0
    ) {
      throw new TypeError("each timestamp must be a non-negative integer");
    }
  }

  if (
    typeof windowMs !== "number" ||
    !Number.isFinite(windowMs) ||
    !Number.isInteger(windowMs) ||
    windowMs <= 0
  ) {
    throw new TypeError("windowMs must be a positive integer");
  }

  if (
    typeof nowMs !== "number" ||
    !Number.isFinite(nowMs) ||
    !Number.isInteger(nowMs) ||
    nowMs < 0
  ) {
    throw new TypeError("nowMs must be a non-negative integer");
  }

  const filtered = (eventTimestampsMs as number[]).filter(
    (ts) => nowMs - ts < windowMs
  );

  const count = filtered.length;

  const ratePerSecond =
    Math.round((count / (windowMs / 1000)) * 10000) / 10000;

  const oldestEventMs =
    count === 0 ? null : Math.min(...filtered);

  return { count, ratePerSecond, oldestEventMs };
}

export { computeSlidingWindowRate };