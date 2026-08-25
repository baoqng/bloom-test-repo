// bloom-deps:

function validateUnixTimestamp(value: unknown): number {
  if (typeof value !== "number") {
    throw new TypeError("Timestamp must be a number");
  }

  if (!isFinite(value)) {
    throw new TypeError("Timestamp must be finite");
  }

  if (value < 0 || value !== Math.floor(value)) {
    throw new RangeError("Timestamp must be a non-negative integer");
  }

  if (value > 32503680000) {
    throw new RangeError("Timestamp must not exceed 32503680000");
  }

  return value;
}

export { validateUnixTimestamp };