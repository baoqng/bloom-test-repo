// bloom-deps:

function mapRecord<K extends string, V, U>(
  record: Record<K, V>,
  fn: (value: V, key: K) => U
): Record<K, U> {
  // Validate record parameter
  if (
    record === null ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    throw new TypeError(
      "record must be a non-null object (not an array or primitive)"
    );
  }

  // Validate fn parameter
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  // Create new record with transformed values
  const result: Record<K, U> = {} as Record<K, U>;

  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const typedKey = key as K;
      result[typedKey] = fn(record[typedKey], typedKey);
    }
  }

  return result;
}

export { mapRecord };