// bloom-deps:

export function computeSlidingWindowRate(
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
      !isFinite(element) ||
      !Number.isInteger(element) ||
      element < 0
    ) {
      throw new TypeError("each timestamp must be a non-negative integer");
    }
  }

  if (
    typeof windowMs !== "number" ||
    !isFinite(windowMs) ||
    !Number.isInteger(windowMs) ||
    windowMs <= 0
  ) {
    throw new TypeError("windowMs must be a positive integer");
  }

  if (
    typeof nowMs !== "number" ||
    !isFinite(nowMs) ||
    !Number.isInteger(nowMs) ||
    nowMs < 0
  ) {
    throw new TypeError("nowMs must be a non-negative integer");
  }

  const windowedEvents = (eventTimestampsMs as number[]).filter(
    (timestamp) => nowMs - timestamp < windowMs
  );

  const count = windowedEvents.length;

  const rawRate = count / (windowMs / 1000);
  const ratePerSecond = Math.round(rawRate * 10000) / 10000;

  const oldestEventMs =
    count === 0 ? null : Math.min(...windowedEvents);

  return { count, ratePerSecond, oldestEventMs };
}