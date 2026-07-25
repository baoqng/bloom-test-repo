// bloom-deps: zod@^3

import { ZodIssue } from "zod";

export function summariseZodIssues(issues: ZodIssue[]): string {
  if (issues.length === 0) {
    return "";
  }
  return issues.map((issue) => issue.message).join("; ");
}