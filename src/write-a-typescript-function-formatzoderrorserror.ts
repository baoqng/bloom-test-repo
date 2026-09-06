// bloom-deps: zod@^4

import { ZodError } from 'zod';

export function formatZodErrors(error: unknown): Record<string, string[]> {
  // [MANDATORY] Plain-object check: null+typeof+Array+getPrototypeOf all four.
  if (
    error === null ||
    typeof error !== 'object' ||
    Array.isArray(error)
  ) {
    throw new TypeError('Argument must be a ZodError instance');
  }

  // Additional check to ensure it's a ZodError by checking for required properties
  if (!('issues' in error) || !Array.isArray((error as any).issues)) {
    throw new TypeError('Argument must be a ZodError instance');
  }

  const zodError = error as ZodError;

  const fieldErrors: Record<string, string[]> = {};

  // Process each issue in the ZodError
  for (const issue of zodError.issues) {
    const path = issue.path;
    
    // Skip issues without a path (form-level errors)
    if (path.length === 0) {
      continue;
    }
    
    // Build the field key from the path
    const fieldKey = path.join('.');
    
    // Initialize the array if it doesn't exist
    if (!fieldErrors[fieldKey]) {
      fieldErrors[fieldKey] = [];
    }
    
    // Add the error message
    fieldErrors[fieldKey].push(issue.message);
  }

  // [MANDATORY] After split+skip-empty loop, guard against all-empty segments by tracking a boolean and throwing if no valid entry was processed.
  // In this case, we return an empty object if there are no field errors
  // (as per the requirement: "Return an empty object if there are no field errors")
  if (Object.keys(fieldErrors).length === 0) {
    return {};
  }

  return fieldErrors;
}