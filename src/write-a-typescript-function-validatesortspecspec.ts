// bloom-deps:

function validateSortSpec(spec: unknown, allowedFields: unknown): { field: string; direction: 'asc' | 'desc' } {
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
    throw new TypeError("spec must be a plain object");
  }

  if (
    !Array.isArray(allowedFields) ||
    allowedFields.length === 0 ||
    !allowedFields.every((f) => typeof f === 'string')
  ) {
    throw new TypeError("allowedFields must be a non-empty array of strings");
  }

  const specObj = spec as Record<string, unknown>;

  if (typeof specObj.field !== 'string') {
    throw new TypeError("field must be a string");
  }

  if (!(allowedFields as string[]).includes(specObj.field)) {
    throw new SyntaxError(`Unknown sort field: ${specObj.field}`);
  }

  if (typeof specObj.direction !== 'string') {
    throw new TypeError("direction must be a string");
  }

  if (specObj.direction !== 'asc' && specObj.direction !== 'desc') {
    throw new SyntaxError("direction must be 'asc' or 'desc'");
  }

  return { field: specObj.field, direction: specObj.direction as 'asc' | 'desc' };
}

export { validateSortSpec };