// bloom-deps:

export function groupByKeyV8(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = {};

  for (const item of items) {
    const bucketKey = item[key] ?? '';

    if (!result[bucketKey]) {
      result[bucketKey] = [];
    }

    result[bucketKey].push(item);
  }

  return result;
}