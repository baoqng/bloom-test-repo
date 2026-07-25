// bloom-deps: zod@^3

import { ZodIssue } from 'zod';

export class ZodError extends Error {
  public readonly issues: ZodIssue[];
  public readonly name = 'ZodError';

  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError('ZodError requires at least one issue; got empty array');
    }

    const message = ZodError.createMessage(issues);
    super(message);
    this.issues = issues;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodError);
    }
  }

  private static createMessage(issues: ZodIssue[]): string {
    if (issues.length === 0) {
      return 'Validation error';
    }

    const paths = issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
        return `${path}: ${issue.message}`;
      })
      .join('; ');

    return `Validation error: ${paths}`;
  }

  public get errors(): ZodIssue[] {
    return this.issues;
  }

  public toString(): string {
    return this.message;
  }
}

export function createZodError(issues: ZodIssue[]): ZodError {
  try {
    return new ZodError(issues);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('ZodError requires at least one issue')) {
      throw error;
    }
    throw new TypeError(`Failed to create ZodError: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}