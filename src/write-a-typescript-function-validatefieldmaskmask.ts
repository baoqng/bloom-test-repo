// bloom-deps:

function validateFieldMask(mask: unknown, allowedFields: unknown): string[] {
  if (typeof mask !== "string") {
    throw new TypeError("mask must be a string");
  }

  if (
    !Array.isArray(allowedFields) ||
    allowedFields.some((el) => typeof el !== "string")
  ) {
    throw new TypeError("allowedFields must be an array of strings");
  }

  if (allowedFields.length === 0) {
    throw new RangeError("allowedFields must not be empty");
  }

  if (mask === "") {
    return [];
  }

  const parts = mask.split(",");
  const trimmed = parts.map((p) => p.trim());

  for (const field of trimmed) {
    if (field === "") {
      throw new SyntaxError("Empty field name in mask");
    }
  }

  for (const field of trimmed) {
    if (!allowedFields.includes(field)) {
      throw new SyntaxError(`Unknown field: ${field}`);
    }
  }

  const seen = new Set<string>();
  const result: string[] = [];
  for (const field of trimmed) {
    if (!seen.has(field)) {
      seen.add(field);
      result.push(field);
    }
  }

  return result;
}

export { validateFieldMask };