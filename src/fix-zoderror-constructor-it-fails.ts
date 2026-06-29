// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

function createZodError(issues: ZodIssue[]): ZodError {
  if (!Array.isArray(issues)) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    if (issue == null || typeof issue !== 'object') {
      throw new TypeError(`Invalid issue at index ${i}: expected a valid ZodIssue object`);
    }
    if (!('code' in issue) || !('message' in issue) || !('path' in issue)) {
      throw new TypeError(`Invalid issue at index ${i}: missing required fields (code, message, path)`);
    }
  }
  return new ZodError(issues);
}

export { createZodError };
export type { ZodIssue };