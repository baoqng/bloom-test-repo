```
import { ZodError, ZodIssue } from "zod";

const OriginalZodError = ZodError;

class SafeZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    super(issues);
  }
}

export function createZodError(issues: ZodIssue[]): ZodError {
  if (typeof issues !== "object" || issues === null || !Array.isArray(issues)) {
    throw new TypeError("issues must be an array");
  }
  if (issues.length === 0) {
    throw new TypeError(
      "ZodError requires at least one issue; got empty array"
    );
  }
  return new SafeZodError(issues);
}

export { SafeZodError as ZodErrorSafe };
```