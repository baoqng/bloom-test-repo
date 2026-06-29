// bloom-deps: zod@^3

import { ZodError, ZodIssue } from 'zod';

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = 'ServiceError';
  }
}

function createZodError(issues: ZodIssue[]): ZodError {
  if (issues.length === 0) {
    throw new TypeError('ZodError requires at least one issue; got empty array');
  }
  try {
    return new ZodError(issues);
  } catch (error) {
    throw new ServiceError('operation failed', { cause: error });
  }
}

export { createZodError, ServiceError };
export type { ZodIssue };