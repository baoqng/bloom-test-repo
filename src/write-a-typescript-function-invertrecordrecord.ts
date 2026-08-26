// bloom-deps:

function invertRecord(record: unknown): Record<string, string> {
  if (record === null || typeof record !== "object" || Array.isArray(record)) {
    throw new TypeError("record must be a plain object");
  }

  const input = record as Record<string, unknown>;
  const result: Record<string, string> = {};
  const seenValues = new Set<string>();

  for (const key of Object.keys(input)) {
    const value = input[key];

    if (typeof value !== "string") {
      throw new TypeError(`Value for key '${key}' must be a string`);
    }

    if (seenValues.has(value)) {
      throw new RangeError(`Duplicate value '${value}' — cannot invert`);
    }

    seenValues.add(value);
    result[value] = key;
  }

  return result;
}

export { invertRecord };