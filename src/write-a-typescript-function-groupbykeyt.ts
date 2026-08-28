// bloom-deps:

export function groupByKey<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  // Type validation: arr must be an Array
  if (!Array.isArray(arr)) {
    throw new TypeError("arr must be an Array");
  }

  // Type validation: key must be a string
  if (typeof key !== "string") {
    throw new TypeError("key must be a string");
  }

  // Range validation: key must not be empty
  if (key === "") {
    throw new RangeError("key must not be an empty string");
  }

  // Initialize result object
  const result: Record<string, T[]> = {};

  // Iterate through array and group elements
  for (const element of arr) {
    // Get the value at the specified key
    const value = element[key];

    // Determine the group key
    let groupKey: string;
    if (value === null || value === undefined) {
      groupKey = "__null__";
    } else if (typeof value === "string") {
      groupKey = value;
    } else {
      // Convert non-string, non-null values to their string representation
      groupKey = String(value);
    }

    // Add element to the appropriate group
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(element);
  }

  return result;
}