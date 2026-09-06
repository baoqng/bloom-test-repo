// bloom-deps: zod@^3

import { ZodError } from "zod";

export function flattenError(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path;
    const message = issue.message;

    if (path.length === 0) {
      if (!("_root" in result)) {
        result["_root"] = message;
      }
    } else {
      const key = path.map(String).join(".");
      if (!(key in result)) {
        result[key] = message;
      }
    }
  }

  return result;
}