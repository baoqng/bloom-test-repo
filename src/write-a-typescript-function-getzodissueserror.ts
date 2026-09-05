// bloom-deps: zod@^3

import type { ZodError, ZodIssue } from 'zod';

/**
 * Extracts the raw ZodIssue array from a ZodError.
 * 
 * This function provides a simple interface to access the underlying issues
 * array from a ZodError instance, following the type structure defined in
 * the Zod codebase.
 * 
 * @param error - A ZodError instance to extract issues from
 * @returns The array of ZodIssue objects contained in the error
 * @throws {TypeError} If the input is not a valid ZodError instance
 */
export function getZodIssues(error: ZodError): ZodIssue[] {
  // Validate that the input is actually a ZodError instance
  if (!error || typeof error !== 'object') {
    throw new TypeError('Input must be a ZodError instance');
  }

  if (!(error instanceof Error)) {
    throw new TypeError('Input must be a ZodError instance');
  }

  if (error.name !== 'ZodError') {
    throw new TypeError('Input must be a ZodError instance');
  }

  // Check that issues property exists and is an array
  if (!Array.isArray(error.issues)) {
    throw new TypeError('ZodError must have an issues array property');
  }

  // Return the issues array directly
  return error.issues;
}

export default getZodIssues;