// bloom-deps: zod@^3

import { ZodIssue } from "zod";

export function summariseZodIssues(issues: ZodIssue[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const pathSegments = issue.path;
    const pathString =
      pathSegments.length === 0
        ? "root"
        : pathSegments.map((segment) => String(segment)).join(".");
    return `${pathString}: ${issue.message}`;
  });
}