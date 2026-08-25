// bloom-deps:

function buildFieldFilter(
  field: unknown,
  operator: unknown,
  value: unknown
): { field: string; operator: string; value: string | number | boolean } {
  if (typeof field !== "string" || field.length === 0) {
    throw new TypeError("field must be a non-empty string");
  }

  if (typeof operator !== "string") {
    throw new TypeError("operator must be a string");
  }

  const validOperators = ["eq", "ne", "lt", "lte", "gt", "gte", "contains"];
  if (!validOperators.includes(operator)) {
    throw new SyntaxError(
      "operator must be one of: eq, ne, lt, lte, gt, gte, contains"
    );
  }

  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    typeof value !== "boolean"
  ) {
    throw new TypeError("value must be a string, number, or boolean");
  }

  if (typeof value === "number" && !isFinite(value)) {
    throw new RangeError("value must be finite");
  }

  return { field, operator, value };
}

export { buildFieldFilter };