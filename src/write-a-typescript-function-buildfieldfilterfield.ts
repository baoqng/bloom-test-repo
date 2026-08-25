// bloom-deps:

export function buildFieldFilter(
  field: unknown,
  operator: unknown,
  value: unknown
): { field: string; operator: string; value: string | number | boolean } {
  // Validate field
  if (typeof field !== "string") {
    throw new TypeError("field must be a non-empty string");
  }

  if (field === "") {
    throw new TypeError("field must be a non-empty string");
  }

  // Validate operator
  if (typeof operator !== "string") {
    throw new TypeError("operator must be a string");
  }

  const validOperators = ["eq", "ne", "lt", "lte", "gt", "gte", "contains"];
  if (!validOperators.includes(operator)) {
    throw new SyntaxError(
      "operator must be one of: eq, ne, lt, lte, gt, gte, contains"
    );
  }

  // Validate value type
  const valueType = typeof value;
  if (valueType !== "string" && valueType !== "number" && valueType !== "boolean") {
    throw new TypeError("value must be a string, number, or boolean");
  }

  // Validate number constraints
  if (typeof value === "number") {
    if (!isFinite(value)) {
      throw new RangeError("value must be finite");
    }
  }

  // Return as-is if all validations pass
  return {
    field,
    operator,
    value,
  };
}