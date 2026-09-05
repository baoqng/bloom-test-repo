// bloom-deps: zod@^4

import type { ZodError as $ZodError, ZodIssue as $ZodIssue } from 'zod';

export function formatZodError(error: $ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    // Determine the key for this issue
    let key: string;
    
    if (issue.path.length === 0) {
      // Root-level issue
      key = '_root';
    } else {
      // Join all path segments with '.'
      key = issue.path
        .map((segment) => String(segment))
        .join('.');
    }

    // Only store the first error message for each path key
    if (!(key in result)) {
      result[key] = issue.message;
    }
  }

  return result;
}