// bloom-deps:

function mapRecordValues<V, R>(record: unknown, fn: unknown): Record<string, R> {
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    throw new TypeError("record must be a plain object");
  }
  if (typeof fn !== 'function') {
    throw new TypeError("fn must be a function");
  }
  const input = record as Record<string, V>;
  const result: Record<string, R> = {};
  for (const key of Object.keys(input)) {
    result[key] = (fn as (value: V, key: string) => R)(input[key], key);
  }
  return result;
}

export { mapRecordValues };