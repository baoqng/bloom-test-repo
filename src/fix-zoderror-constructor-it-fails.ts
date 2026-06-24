```
import { ZodError, ZodIssue } from "zod";

const OriginalZodError = ZodError;

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "ServiceError";
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

class PatchedZodError extends OriginalZodError {
  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    super(issues);
  }
}

export { PatchedZodError as ZodError };
export type { ZodIssue };

export function createZodError(issues: ZodIssue[]): PatchedZodError {
  if (issues.length === 0) {
    throw new TypeError(
      "ZodError requires at least one issue; got empty array"
    );
  }
  try {
    return new PatchedZodError(issues);
  } catch (error) {
    if (error instanceof TypeError) {
      throw error;
    }
    throw new ServiceError("operation failed", { cause: error });
  }
}

export function isZodError(value: unknown): value is PatchedZodError {
  return value instanceof OriginalZodError;
}

export function validateZodIssues(issues: unknown): issues is ZodIssue[] {
  if (!Array.isArray(issues)) {
    return false;
  }
  if (issues.length === 0) {
    return false;
  }
  return issues.every((issue): issue is ZodIssue => {
    if (issue === null || typeof issue !== "object") {
      return false;
    }
    if (!("code" in issue && "path" in issue && "message" in issue)) {
      return false;
    }
    if (typeof issue.message !== "string") {
      return false;
    }
    if (!Array.isArray(issue.path)) {
      return false;
    }
    return true;
  });
}

export function safeCreateZodError(
  issues: ZodIssue[]
): { success: true; error: PatchedZodError } | { success: false; cause: ServiceError } {
  if (issues.length === 0) {
    return {
      success: false,
      cause: new ServiceError(
        "operation failed",
        {
          cause: new TypeError(
            "ZodError requires at least one issue; got empty array"
          ),
        }
      ),
    };
  }
  try {
    const error = new PatchedZodError(issues);
    return { success: true, error };
  } catch (err) {
    throw new ServiceError("operation failed", { cause: err });
  }
}
```