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

// Patch the ZodError constructor to validate issues length
const originalConstructor = ZodError;

function patchZodError(): void {
  const proto = ZodError.prototype;
  const OrigCtor = ZodError as unknown as new (issues: ZodIssue[]) => ZodError;

  // We monkey-patch by wrapping the ZodError class
  // Since we can't reassign imports directly, we export the patched version
}

export { PatchedZodError as ZodError };
export type { ZodIssue };

// Apply the patch globally by overriding the prototype constructor reference
Object.defineProperty(ZodError.prototype, "constructor", {
  value: PatchedZodError,
  writable: true,
  configurable: true,
});

// Also patch the actual ZodError function to intercept new ZodError(...)
// by replacing its implementation
const ZodErrorProxy = new Proxy(ZodError, {
  construct(target, args: [ZodIssue[]]) {
    const [issues] = args;
    if (!issues || issues.length === 0) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }
    return new target(issues);
  },
});

export { ZodErrorProxy as PatchedZodErrorProxy };

// Primary export: a validated ZodError factory and the patched class
export function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new OriginalZodError(issues);
}

export { PatchedZodError };