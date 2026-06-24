```
import { ZodError, ZodIssue } from "zod";

const OriginalZodError = ZodError;

class PatchedZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (!Array.isArray(issues) || issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    super(issues);
  }
}

export { PatchedZodError as ZodError };
export default PatchedZodError;
```