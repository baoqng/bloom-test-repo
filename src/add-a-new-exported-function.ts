// bloom-deps: zod@^3

import { ZodIssue } from "zod";

export function summariseZodIssues(issues: ZodIssue[]): string[] {
  if (issues.length === 0) {
    return [];
  }

  return issues.map((issue) => {
    const path = issue.path;
    let pathString: string;

    if (path.length === 0) {
      pathString = "root";
    } else {
      pathString = path.map((segment) => String(segment)).join(".");
    }

    return `${pathString}: ${issue.message}`;
  });
}