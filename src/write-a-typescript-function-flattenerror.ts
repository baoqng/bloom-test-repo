// bloom-deps: zod@^3

import { ZodError } from "zod";

export function flattenError(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const key =
      issue.path.length === 0
        ? "_root"
        : issue.path.map(String).join(".");

    if (!(key in result)) {
      result[key] = issue.message;
    }
  }

  return result;
}