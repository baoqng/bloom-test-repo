// bloom-deps:

export function groupByKeyV6(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = {};

  for (const item of items) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const bucketKey =
      typeof item[key] === "string" ? item[key] : "";

    if (!result[bucketKey]) {
      result[bucketKey] = [];
    }

    result[bucketKey].push(item);
  }

  return result;
}