// bloom-deps:

export function groupByKeyV3(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = {};

  for (const item of items) {
    // Validate that item is not null or undefined
    if (item === null || item === undefined) {
      continue;
    }

    // Get the grouping key value, defaulting to empty string if missing
    const groupKey = item[key] ?? "";

    // Initialize the bucket if it doesn't exist
    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    // Add the item to the appropriate bucket without mutating input
    result[groupKey].push(item);
  }

  return result;
}