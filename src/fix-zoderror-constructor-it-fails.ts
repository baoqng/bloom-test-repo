// bloom-deps: zod@^3

import { ZodError, ZodIssue } from 'zod';

const OriginalZodError = ZodError;

class PatchedZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (!Array.isArray(issues)) {
      throw new TypeError('ZodError requires at least one issue; got empty array');
    }
    if (issues.length === 0) {
      throw new TypeError('ZodError requires at least one issue; got empty array');
    }
    super(issues);
  }
}

// Patch the ZodError constructor to validate issues length
const originalConstructor = ZodError;

function createZodError(issues: ZodIssue[]): ZodError {
  if (!Array.isArray(issues)) {
    throw new TypeError('ZodError requires at least one issue; got empty array');
  }
  if (issues.length === 0) {
    throw new TypeError('ZodError requires at least one issue; got empty array');
  }
  return new originalConstructor(issues);
}

export { PatchedZodError as ZodError, createZodError };
export type { ZodIssue };