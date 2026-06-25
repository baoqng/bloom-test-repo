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
    if (firstIssue === undefined || firstIssue === null) {
      throw new TypeError("ZodError requires at least one valid issue");
    }

    const message = issues
      .map((issue) => {
        if (issue === undefined || issue === null) {
          throw new TypeError("ZodError issue cannot be null or undefined");
        }
        const path =
          issue.path !== undefined && issue.path !== null && issue.path.length > 0
            ? issue.path.join(".")
            : "root";
        const code =
          typeof issue.code === "string" && issue.code.length > 0
            ? issue.code
            : "unknown";
        const msg =
          typeof issue.message === "string" && issue.message.length > 0
            ? issue.message
            : "Unknown error";
        return `[${code}] at ${path}: ${msg}`;
      })
      .join("; ");

    super(message);

    this.name = "ZodError";
    this.issues = issues;

    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, ZodError);
    }
  }

  public get formErrors(): { formErrors: string[]; fieldErrors: Record<string, string[]> } {
    const formErrors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      if (issue === undefined || issue === null) {
        continue;
      }

      const path = issue.path;
      const msg =
        typeof issue.message === "string" && issue.message.length > 0
          ? issue.message
          : "Unknown error";

      if (path === undefined || path === null || path.length === 0) {
        formErrors.push(msg);
      } else {
        const key = path.join(".");
        if (key !== undefined && key !== null && key.length > 0) {
          const existing = fieldErrors[key];
          if (existing !== undefined) {
            existing.push(msg);
          } else {
            fieldErrors[key] = [msg];
          }
        }
      }
    }

    return { formErrors, fieldErrors };
  }

  public flatten(): { formErrors: string[]; fieldErrors: Record<string, string[]> } {
    return this.formErrors;
  }

  public toString(): string {
    return `ZodError: ${this.message}`;
  }
}
```