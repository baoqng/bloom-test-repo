// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

const OriginalZodError = ZodError;

class PatchedZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }
    super(issues);
  }
}

// Patch the ZodError constructor globally
(ZodError as any).prototype.constructor = PatchedZodError;

// Override the ZodError class itself by monkey-patching
const originalCreate = (ZodError as any).create;

// We need to replace ZodError's constructor behavior
// The most reliable approach is to extend and export
export { PatchedZodError as ZodError };
export type { ZodIssue };

export function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new OriginalZodError(issues);
}

// Wrap the ZodError constructor to enforce the validation
const ZodErrorProxy = new Proxy(OriginalZodError, {
  construct(target, args: [ZodIssue[]]) {
    const issues = args[0];
    if (!issues || issues.length === 0) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }
    return new target(issues);
  },
});

export { ZodErrorProxy };

export default PatchedZodError;