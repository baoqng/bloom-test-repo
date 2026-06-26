// bloom-deps:

export interface ZodIssue {
  code: string;
  message: string;
  path: (string | number)[];
  [key: string]: unknown;
}

export class ZodError extends Error {
  issues: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    if (issues.length === 0) {
      throw new TypeError("ZodError requires at least one issue; got empty array");
    }

    const message = issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `${path}: ${issue.message}`;
      })
      .join("; ");

    super(message);

    this.name = "ZodError";
    this.issues = issues;

    console.error(`ZodError created with ${issues.length} issue(s): ${message}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodError);
    }
  }

  get errors(): ZodIssue[] {
    return this.issues;
  }

  addIssue(issue: ZodIssue): void {
    this.issues.push(issue);
    this.message = this.issues
      .map((i) => {
        const path = i.path.length > 0 ? i.path.join(".") : "(root)";
        return `${path}: ${i.message}`;
      })
      .join("; ");
  }

  flatten(): { formErrors: string[]; fieldErrors: Record<string, string[]> } {
    const formErrors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        formErrors.push(issue.message);
      } else {
        const key = issue.path.join(".");
        if (fieldErrors[key] === undefined) {
          fieldErrors[key] = [];
        }
        fieldErrors[key].push(issue.message);
      }
    }

    return { formErrors, fieldErrors };
  }

  format(): Record<string, unknown> {
    const result: Record<string, unknown> = { _errors: [] as string[] };

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        (result._errors as string[]).push(issue.message);
      } else {
        let current = result;
        for (let i = 0; i < issue.path.length; i++) {
          const segment = String(issue.path[i]);
          if (i === issue.path.length - 1) {
            if (current[segment] === undefined) {
              current[segment] = { _errors: [] as string[] };
            }
            ((current[segment] as Record<string, unknown>)._errors as string[]).push(issue.message);
          } else {
            if (current[segment] === undefined) {
              current[segment] = { _errors: [] as string[] };
            }
            current = current[segment] as Record<string, unknown>;
          }
        }
      }
    }

    return result;
  }

  static isZodError(value: unknown): value is ZodError {
    return value instanceof ZodError;
  }

  toString(): string {
    return `ZodError: ${this.message}`;
  }
}