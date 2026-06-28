// bloom-deps: zod@^3

import { ZodIssue } from "zod";

export function summariseZodIssues(issues: ZodIssue[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const path = issue.path;
    const pathString =
      path.length === 0
        ? "root"
        : path.map((segment) => String(segment)).join(".");
    return `${pathString}: ${issue.message}`;
  });
}