// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

function createSafeZodError(issues: ZodIssue[]): ZodError {
  if (!Array.isArray(issues)) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  for (let i = 0; i < issues.length; i++) {
    if (issues[i] == null || typeof issues[i] !== 'object') {
      throw new TypeError(`Invalid issue at index ${i}: expected a ZodIssue object`);
    }
  }
  return new ZodError(issues);
}

export { createSafeZodError };
export type { ZodIssue };