// bloom-deps:

function mapRecord<K extends string, V, U>(
  record: Record<K, V>,
  fn: (value: V, key: K) => U
): Record<K, U> {
  if (record === null || record === undefined || typeof record !== 'object' || Array.isArray(record)) {
    throw new TypeError('record must be a non-null, non-array object');
  }

  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
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