// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

export function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new ZodError(issues);
}

export { ZodError, ZodIssue };