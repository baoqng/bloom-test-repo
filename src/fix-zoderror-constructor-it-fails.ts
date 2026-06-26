// bloom-deps:

export interface ZodIssue {
  code: string;
  message: string;
  path: (string | number)[];
  [key: string]: unknown;
}

export class ZodError extends Error {
  public readonly issues: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }

    const message = issues
      .map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      })
      .join("; ");

    super(message);

    this.name = "ZodError";
    this.issues = issues;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodError);
    }
  }

  get errors(): ZodIssue[] {
    return this.issues;
  }

  toString(): string {
    return `ZodError: ${this.message}`;
  }

  flatten(): {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  } {
    const formErrors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        formErrors.push(issue.message);
      } else {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) {
          fieldErrors[key] = [];
        }
        fieldErrors[key].push(issue.message);
      }
    }

    return { formErrors, fieldErrors };
  }

  format(): Record<string, { _errors: string[] }> {
    const formatted: Record<string, { _errors: string[] }> = {
      _root: { _errors: [] },
    };

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        formatted["_root"]._errors.push(issue.message);
      } else {
        const key = issue.path.join(".");
        if (!formatted[key]) {
          formatted[key] = { _errors: [] };
        }
        formatted[key]._errors.push(issue.message);
      }
    }

    return formatted;
  }

  static isZodError(value: unknown): value is ZodError {
    return value instanceof ZodError;
  }
}