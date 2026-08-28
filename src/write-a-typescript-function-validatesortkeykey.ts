// bloom-deps:

export function validateSortKey(
  key: unknown,
  allowedFields: unknown
): { field: string; direction: "asc" | "desc" } {
  // Type check for key
  if (typeof key !== "string") {
    throw new TypeError("key must be a string");
  }

  // Empty/whitespace check for key
  if (!key.trim()) {
    throw new RangeError("key must not be empty");
  }

  // Validate allowedFields
  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((el) => typeof el === "string")
  ) {
    throw new TypeError("allowedFields must be a non-empty array of strings");
  }

  const trimmed = key.trim();

  // Split by ':' and check number of parts
  const parts = trimmed.split(":");
  if (parts.length > 2) {
    throw new RangeError("key must have at most one ':' separator");
  }

  let field: string;
  let direction: "asc" | "desc";

  if (parts.length === 1) {
    field = trimmed;
    direction = "asc";
  } else {
    // parts.length === 2
    field = parts[0].trim();
    const rawDirection = parts[1].trim().toLowerCase();
    direction = rawDirection as "asc" | "desc";
  }

  // Check field is not empty
  if (!field) {
    throw new RangeError("field must not be empty");
  }

  // Check field is in allowedFields (case-sensitive)
  if (!(allowedFields as string[]).includes(field)) {
    throw new RangeError(`unknown field: ${field}`);
  }

  // Check direction is valid
  if (direction !== "asc" && direction !== "desc") {
    throw new RangeError("direction must be 'asc' or 'desc'");
  }

  return { field, direction };
}