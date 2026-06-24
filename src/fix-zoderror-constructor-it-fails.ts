```typescript
import { ZodIssue } from "zod";

export class ZodError extends Error {
  public readonly issues: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }

    const firstIssue = issues[0];
    if (!firstIssue) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }

    super(firstIssue.message);

    this.issues = issues;
    this.name = "ZodError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodError);
    }
  }

  get message(): string {
    return this.issues
      .map((issue) => {
        const path =
          issue.path.length > 0 ? `[${issue.path.join(".")}]: ` : "";
        return `${path}${issue.message}`;
      })
      .join("; ");
  }

  public format(): Record<string, { _errors: string[] }> {
    const formatted: Record<string, { _errors: string[] }> = {
      _errors: [],
    };

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        const root = formatted["_errors"];
        if (root && Array.isArray(root)) {
          root.push(issue.message);
        }
      } else {
        let current = formatted;
        for (let i = 0; i < issue.path.length - 1; i++) {
          const key = String(issue.path[i]);
          if (!current[key]) {
            current[key] = { _errors: [] };
          }
          const next = current[key];
          if (next && typeof next === "object" && "_errors" in next) {
            current = next as Record<string, { _errors: string[] }>;
          }
        }
        const lastKey = String(issue.path[issue.path.length - 1]);
        if (!current[lastKey]) {
          current[lastKey] = { _errors: [] };
        }
        const target = current[lastKey];
        if (target && typeof target === "object" && "_errors" in target && Array.isArray(target._errors)) {
          target._errors.push(issue.message);
        }
      }
    }

    return formatted;
  }

  public flatten(): {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  } {
    const formErrors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        formErrors.push(issue.message);
      } else {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) {
          fieldErrors[key] = [];
        }
        const fieldErrorList = fieldErrors[key];
        if (fieldErrorList && Array.isArray(fieldErrorList)) {
          fieldErrorList.push(issue.message);
        }
      }
    }

    return { formErrors, fieldErrors };
  }

  public toFieldErrors(): Array<{ field: string; message: string; code: string }> {
    return this.issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "_root",
      message: issue.message,
      code: issue.code,
    }));
  }

  public static isZodError(value: unknown): value is ZodError {
    return value instanceof ZodError;
  }
}
```