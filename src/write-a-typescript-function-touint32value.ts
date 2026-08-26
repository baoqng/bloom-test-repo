// bloom-deps:

function toUint32(value: unknown): number {
  if (typeof value !== "number") {
    throw new TypeError("Expected a number");
  }
  if (!isFinite(value)) {
    throw new TypeError("Value must be finite");
  }
  return (value >>> 0);
}

export { toUint32 };