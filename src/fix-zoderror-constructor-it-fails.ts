```
import { ZodError, ZodIssue } from "zod";

const OriginalZodError = ZodError;

class SafeZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (!Array.isArray(issues) || issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    super(issues);
  }
}

export { SafeZodError as ZodError };
export default SafeZodError;
```