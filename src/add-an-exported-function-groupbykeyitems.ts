// bloom-deps:

export function groupByKey(
  items: Record<string, string>[],
  key: string
): Record<string, Record<string, string>[]> {
  const result: Record<string, Record<string, string>[]> = {};

  for (const item of items) {
    // Validate that item is an object before accessing properties
    if (item === null || typeof item !== 'object') {
      continue;
    }

    // Get the key value, defaulting to empty string if missing
    const keyValue = item[key];
    const groupKey = keyValue === null || keyValue === undefined ? '' : String(keyValue);

    // Initialize the bucket if it doesn't exist
    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    // Add the item to the bucket
    result[groupKey].push(item);
  }

  return result;
}