// bloom-deps:

export function computeWindowedCount(
  events: unknown,
  windowStartMs: unknown,
  windowEndMs: unknown
): { count: number; density: number; firstEventMs: number | null; lastEventMs: number | null } {
  if (!Array.isArray(events)) {
    throw new TypeError("events must be an array");
  }

  for (const el of events) {
    if (
      typeof el !== "number" ||
      !Number.isFinite(el) ||
      !Number.isInteger(el) ||
      el < 0
    ) {
      throw new TypeError("each event timestamp must be a non-negative integer");
    }
  }

  if (
    typeof windowStartMs !== "number" ||
    !Number.isFinite(windowStartMs) ||
    !Number.isInteger(windowStartMs) ||
    windowStartMs < 0
  ) {
    throw new TypeError("windowStartMs must be a non-negative integer");
  }

  if (
    typeof windowEndMs !== "number" ||
    !Number.isFinite(windowEndMs) ||
    !Number.isInteger(windowEndMs) ||
    windowEndMs < 0
  ) {
    throw new TypeError("windowEndMs must be a non-negative integer");
  }

  if (windowEndMs <= windowStartMs) {
    throw new RangeError("windowEndMs must be greater than windowStartMs");
  }

  const matching = (events as number[]).filter(
    (ts) => ts >= windowStartMs && ts < windowEndMs
  );

  const count = matching.length;
  const windowDurationSec = (windowEndMs - windowStartMs) / 1000;
  const rawDensity = count / windowDurationSec;
  const density = Math.round(rawDensity * 10000) / 10000;

  const firstEventMs = count > 0 ? Math.min(...matching) : null;
  const lastEventMs = count > 0 ? Math.max(...matching) : null;

  return { count, density, firstEventMs, lastEventMs };
}