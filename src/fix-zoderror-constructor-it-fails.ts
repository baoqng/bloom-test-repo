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
(ZodError as unknown as { new(issues: ZodIssue[]): ZodError }).prototype.constructor = PatchedZodError;

// Override the ZodError class by monkey-patching its constructor behavior
const originalConstructor = ZodError;

function patchZodErrorConstructor() {
  const handler: ProxyHandler<typeof ZodError> = {
    construct(target, args: [ZodIssue[]]) {
      const issues = args[0];
      if (!issues || issues.length === 0) {
        throw new TypeError("ZodError requires at least one issue; got empty array");
      }
      return new target(issues);
    },
  };

  return new Proxy(originalConstructor, handler);
}

export { PatchedZodError as ZodError };
export { ZodIssue };

export function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new OriginalZodError(issues);
}