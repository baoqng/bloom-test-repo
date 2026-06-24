```
import { ZodIssue, ZodError as OriginalZodError } from "zod";

class ZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (!Array.isArray(issues) || issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    super(issues);
  }
}

export { ZodError };
export type { ZodIssue };
```