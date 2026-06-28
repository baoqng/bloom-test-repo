// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

function createSafeZodError(issues: ZodIssue[]): ZodError {
  if (!Array.isArray(issues)) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new ZodError(issues);
}

const OriginalZodError = ZodError;

class SafeZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (!Array.isArray(issues)) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }
    if (issues.length === 0) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }
    super(issues);
  }
}

export { SafeZodError as ZodError, createSafeZodError };
export type { ZodIssue };