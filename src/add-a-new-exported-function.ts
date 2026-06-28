// bloom-deps: zod@^3

import { ZodIssue } from "zod";

export function summariseZodIssues(issues: ZodIssue[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const path = issue.path;
    let pathStr: string;

    if (path.length === 0) {
      pathStr = "root";
    } else {
      pathStr = path.map((segment) => String(segment)).join(".");
    }

    return `${pathStr}: ${issue.message}`;
  });
}