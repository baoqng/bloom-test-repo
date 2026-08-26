export function computeWindowedCount(
  events: any,
  windowStartMs: any,
  windowEndMs: any
): {
  count: number;
  density: number;
  firstEventMs: number | null;
  lastEventMs: number | null;
} {
  // Validate events parameter
  if (!Array.isArray(events)) {
    throw new TypeError('events must be an array');
  }

  // Validate each event timestamp
  for (const event of events) {
    if (
      typeof event !== 'number' ||
      !Number.isFinite(event) ||
      !Number.isInteger(event) ||
      event < 0
    ) {
      throw new TypeError('each event timestamp must be a non-negative integer');
    }
  }

  // Validate windowStartMs
  if (
    typeof windowStartMs !== 'number' ||
    !Number.isFinite(windowStartMs) ||
    !Number.isInteger(windowStartMs) ||
    windowStartMs < 0
  ) {
    throw new TypeError('windowStartMs must be a non-negative integer');
  }

  // Validate windowEndMs
  if (
    typeof windowEndMs !== 'number' ||
    !Number.isFinite(windowEndMs) ||
    !Number.isInteger(windowEndMs) ||
    windowEndMs < 0
  ) {
    throw new TypeError('windowEndMs must be a non-negative integer');
  }

  // Validate windowEndMs > windowStartMs
  if (windowEndMs <= windowStartMs) {
    throw new RangeError('windowEndMs must be greater than windowStartMs');
  }

  // Filter events within window [windowStartMs, windowEndMs)
  const matchingEvents = events.filter(
    (event) => event >= windowStartMs && event < windowEndMs
  );

  const count = matchingEvents.length;
  let firstEventMs: number | null = null;
  let lastEventMs: number | null = null;

  if (count > 0) {
    firstEventMs = Math.min(...matchingEvents);
    lastEventMs = Math.max(...matchingEvents);
  }

  // Calculate density: count / window duration in seconds
  const windowDurationMs = windowEndMs - windowStartMs;
  const windowDurationSeconds = windowDurationMs / 1000;
  const density =
    count === 0 ? 0 : Math.round((count / windowDurationSeconds) * 10000) / 10000;

  return {
    count,
    density,
    firstEventMs,
    lastEventMs,
  };
}