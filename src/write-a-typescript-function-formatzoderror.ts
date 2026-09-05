// bloom-deps: zod@^3

import { ZodError } from 'zod';

export function formatZodError(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path;
    const key = path.length === 0
      ? '_root'
      : path.map(segment => String(segment)).join('.');

    if (!(key in result)) {
      result[key] = issue.message;
    }
  }

  return result;
}