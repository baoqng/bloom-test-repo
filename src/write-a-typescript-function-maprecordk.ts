// bloom-deps:

function mapRecord<K extends string, V, U>(
  record: Record<K, V>,
  fn: (value: V, key: K) => U
): Record<K, U> {
  // Validate that record is a non-null object
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    throw new TypeError(
      `Expected record to be a non-null object, got ${record === null ? 'null' : typeof record}`
    );
  }

  // Validate that fn is a function
  if (typeof fn !== 'function') {
    throw new TypeError(
      `Expected fn to be a function, got ${typeof fn}`
    );
  }

  // Create and return a new record with transformed values
  const result: Record<K, U> = {} as Record<K, U>;

  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      result[key as K] = fn(record[key as K], key as K);
    }
  }

  return result;
}

export { mapRecord };