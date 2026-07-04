// bloom-deps:

export function groupByKeyV5(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = {};

  for (const item of items) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const groupKey = item[key] ?? "";

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
}