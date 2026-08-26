// bloom-deps:

function applyBackpressure(
  currentSize: unknown,
  capacity: unknown,
  softLimit: unknown
): { allowed: boolean; isSoftLimitReached: boolean; isHardLimitReached: boolean } {
  if (
    typeof currentSize !== "number" ||
    !Number.isFinite(currentSize) ||
    !Number.isInteger(currentSize) ||
    currentSize < 0
  ) {
    throw new TypeError("currentSize must be a non-negative integer");
  }

  if (
    typeof capacity !== "number" ||
    !Number.isFinite(capacity) ||
    !Number.isInteger(capacity) ||
    capacity <= 0
  ) {
    throw new TypeError("capacity must be a positive integer");
  }

  if (
    typeof softLimit !== "number" ||
    !Number.isFinite(softLimit) ||
    !Number.isInteger(softLimit) ||
    softLimit <= 0
  ) {
    throw new TypeError("softLimit must be a positive integer");
  }

  if (softLimit > capacity) {
    throw new RangeError("softLimit must not exceed capacity");
  }

  if (currentSize > capacity) {
    throw new RangeError("currentSize must not exceed capacity");
  }

  const isHardLimitReached = currentSize >= capacity;
  const isSoftLimitReached = currentSize >= softLimit;
  const allowed = currentSize < capacity;

  return { allowed, isSoftLimitReached, isHardLimitReached };
}

export { applyBackpressure };