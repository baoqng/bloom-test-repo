// bloom-deps:

function mapRecord<K extends string, V, U>(
  record: Record<K, V>,
  fn: (value: V, key: K) => U
): Record<K, U> {
  if (record === null || record === undefined || typeof record !== "object" || Array.isArray(record)) {
    throw new TypeError(
      `Expected record to be a non-null, non-array object, but received: ${record === null ? "null" : Array.isArray(record) ? "array" : typeof record}`
    );
  }

  if (typeof fn !== "function") {
    throw new TypeError(
      `Expected fn to be a function, but received: ${typeof fn}`
    );
  }

  const result = {} as Record<K, U>;

  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      result[key as K] = fn(record[key as K], key as K);
    }
  }

  return result;
}

export { mapRecord };