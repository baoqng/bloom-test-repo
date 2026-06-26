// bloom-deps: zod@^3

import { ZodError, ZodIssue } from "zod";

export function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
  return new ZodError(issues);
}

export function validateZodErrorIssues(issues: ZodIssue[]): void {
  if (issues.length === 0) {
    throw new TypeError("ZodError requires at least one issue; got empty array");
  }
}

export class SafeZodError extends ZodError {
  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }
    super(issues);
  }
}