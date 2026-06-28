// bloom-deps: zod@^3

import { ZodError, ZodIssue } from 'zod';

const OriginalZodError = ZodError;

class PatchedZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (!Array.isArray(issues)) {
      throw new TypeError('ZodError requires an array of issues');
    }
    if (issues.length === 0) {
      throw new TypeError('ZodError requires at least one issue; got empty array');
    }
    super(issues);
  }
}

export function createZodError(issues: ZodIssue[]): ZodError {
  if (!Array.isArray(issues)) {
    throw new TypeError('ZodError requires an array of issues');
  }
  if (issues.length === 0) {
    throw new TypeError('ZodError requires at least one issue; got empty array');
  }
  return new PatchedZodError(issues);
}

export { PatchedZodError as ZodError };
export type { ZodIssue };