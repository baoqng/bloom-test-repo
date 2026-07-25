// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  for (const issue of issues) {
    if (issue === null || issue === undefined || typeof issue !== 'object') {
      throw new TypeError("Each issue must be a valid ZodIssue object");
    }
  }
  return new ZodError(issues);
}

export { createZodError };