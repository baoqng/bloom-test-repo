// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

function createZodError(issues: ZodIssue[]): ZodError {
  // Validate that issues is an array
  if (!Array.isArray(issues)) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }

  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }

  // Validate each issue has the required ZodIssue shape
  for (const issue of issues) {
    if (
      issue == null ||
      typeof issue !== 'object' ||
      typeof issue.code !== 'string' ||
      typeof issue.message !== 'string' ||
      !Array.isArray(issue.path)
    ) {
      throw new TypeError("Each issue must be a valid ZodIssue with code, message, and path");
    }
  }

  // Use require to get the same ZodError constructor the test uses
  const zod = require('zod');
  return new zod.ZodError(issues);
}

export { createZodError };
export type { ZodIssue };