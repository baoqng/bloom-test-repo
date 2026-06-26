// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

const OriginalZodError = ZodError;

class PatchedZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (!Array.isArray(issues)) {
      throw new TypeError(
        "ZodError requires issues to be an array"
      );
    }
    if (issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    super(issues);
  }
}

export { PatchedZodError as ZodError };
export type { ZodIssue };