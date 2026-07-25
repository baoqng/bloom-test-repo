// bloom-deps: zod@^3

import { ZodIssue } from 'zod';

/**
 * Summarizes an array of ZodIssue objects into human-readable error messages.
 * 
 * @param issues - Array of ZodIssue objects from Zod validation
 * @returns Array of formatted error strings in "PATH: MESSAGE" format
 */
export function summariseZodIssues(issues: ZodIssue[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
    return `${path}: ${issue.message}`;
  });
}

export default summariseZodIssues;