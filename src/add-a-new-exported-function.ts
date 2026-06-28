// bloom-deps: zod@^3

import { ZodIssue } from "zod";

export function summariseZodIssues(issues: ZodIssue[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const path =
      issue.path.length === 0 ? "root" : issue.path.join(".");
    const message = issue.message;
    return `${path}: ${message}`;
  });
}