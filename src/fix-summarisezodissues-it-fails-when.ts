// bloom-deps: zod@^3

import { ZodError } from "zod";

export function summariseZodIssues(error: ZodError): string {
  if (!error.issues || error.issues.length === 0) {
    return "no issues";
  }

  const formatted = error.issues.map((issue) => {
    const path =
      issue.path.length > 0
        ? issue.path.map((segment) => String(segment)).join(".")
        : "root";
    return `${path}: ${issue.message}`;
  });

  return formatted.join("; ");
}