// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

function createZodError(issues: ZodIssue[]): ZodError {
  if (!Array.isArray(issues)) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new ZodError(issues);
}

export { createZodError };