// bloom-deps:

export function buildSqlInClause(
  values: unknown[],
  startIndex: number
): { sql: string; params: unknown[] } {
  // Validate values is an array
  if (!Array.isArray(values)) {
    throw new TypeError("values must be an array");
  }

  // Validate values is not empty
  if (values.length === 0) {
    throw new RangeError("values must not be empty");
  }

  // Validate startIndex is a positive integer
  if (!Number.isInteger(startIndex) || startIndex <= 0 || !isFinite(startIndex)) {
    throw new RangeError("startIndex must be a positive integer");
  }

  // Build the SQL fragment with parameter placeholders
  const placeholders: string[] = [];
  for (let i = 0; i < values.length; i++) {
    placeholders.push(`$${startIndex + i}`);
  }

  const sql = `(${placeholders.join(", ")})`;

  // Return the SQL fragment and values array (without mutating it)
  return {
    sql,
    params: values,
  };
}