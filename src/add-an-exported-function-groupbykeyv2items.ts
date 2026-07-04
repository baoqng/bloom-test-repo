// bloom-deps:

export function groupByKeyV2(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = {};

  for (const item of items) {
    if (item === null || typeof item !== "object") {
      continue;
    }

    const bucketKey = item[key] ?? "";

    if (!result[bucketKey]) {
      result[bucketKey] = [];
    }

    result[bucketKey].push(item);
  }

  return result;
}