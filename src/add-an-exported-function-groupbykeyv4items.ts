// bloom-deps:

export function groupByKeyV4(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = {};

  for (const item of items) {
    if (item === null || item === undefined) {
      continue;
    }

    const groupKey = item[key] ?? '';

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
}