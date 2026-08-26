// bloom-deps:

export function validateTimestampPair(
  start: unknown,
  end: unknown
): { start: number; end: number; durationMs: number } {
  if (typeof start !== "number") {
    throw new TypeError("start must be a number");
  }
  if (typeof end !== "number") {
    throw new TypeError("end must be a number");
  }
  if (!isFinite(start)) {
    throw new TypeError("start must be finite");
  }
  if (!isFinite(end)) {
    throw new TypeError("end must be finite");
  }
  if (start < 0 || !Number.isInteger(start)) {
    throw new RangeError("start must be a non-negative integer");
  }
  if (end < 0 || !Number.isInteger(end)) {
    throw new RangeError("end must be a non-negative integer");
  }
  if (start >= end) {
    throw new RangeError("start must be before end");
  }
  return { start, end, durationMs: end - start };
}