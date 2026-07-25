export function groupByKeyV4(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = Object.create(null);

  for (const item of items) {
    const bucketKey = item[key] ?? '';

    if (!result[bucketKey]) {
      result[bucketKey] = [];
    }

    result[bucketKey].push(item);
  }

  return result;
}