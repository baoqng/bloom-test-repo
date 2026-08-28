// bloom-deps:

function groupByKey<T extends Record<string, unknown>>(arr: T[], key: keyof T): Record<string, T[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError("arr must be an Array");
  }
  if (typeof key !== "string") {
    throw new TypeError("key must be a string");
  }
  if (key === "") {
    throw new RangeError("key must not be an empty string");
  }

  const result: Record<string, T[]> = {};

  for (const element of arr) {
    const value = element[key];
    let groupKey: string;

    if (value === null || value === undefined) {
      groupKey = "__null__";
    } else if (typeof value === "string") {
      groupKey = value;
    } else {
      groupKey = String(value);
    }

    if (!Object.prototype.hasOwnProperty.call(result, groupKey)) {
      result[groupKey] = [];
    }
    result[groupKey].push(element);
  }

  return result;
}

export { groupByKey };