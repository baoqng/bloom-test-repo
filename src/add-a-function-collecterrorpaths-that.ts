// bloom-deps: zod@^3

import { ZodError } from "zod";

export function collectErrorPaths(error: ZodError): string[] {
  if (!error.issues || error.issues.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const issue of error.issues) {
    const path = issue.path;
    const pathString = path.map((segment) => String(segment)).join(".");
    if (!seen.has(pathString)) {
      seen.add(pathString);
      result.push(pathString);
    }
  }

  return result;
}