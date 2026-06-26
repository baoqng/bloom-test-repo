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
        const path = issue.path.length > 0 ? issue.path.join(".") : "<root>";
        return `[${path}]: ${issue.message}`;
      })
      .join("\n");

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

  static create(issues: ZodIssue[]): ZodError {
    return new ZodError(issues);
  }

  toString(): string {
    return `ZodError: ${this.issues.length} issue(s)\n${this.message}`;
  }

  flatten(): { formErrors: string[]; fieldErrors: Record<string, string[]> } {
    const formErrors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        formErrors.push(issue.message);
      } else {
        const key = issue.path[0];
        if (key !== undefined) {
          const keyStr = String(key);
          if (!fieldErrors[keyStr]) {
            fieldErrors[keyStr] = [];
          }
          fieldErrors[keyStr].push(issue.message);
        }
      }
    }

    return { formErrors, fieldErrors };
  }

  format(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      _errors: [] as string[],
    };

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        (result["_errors"] as string[]).push(issue.message);
      } else {
        let current = result;
        for (let i = 0; i < issue.path.length; i++) {
          const segment = issue.path[i];
          if (segment === undefined) {
            continue;
          }
          const segmentStr = String(segment);
          if (i === issue.path.length - 1) {
            if (!current[segmentStr]) {
              current[segmentStr] = { _errors: [] as string[] };
            }
            const node = current[segmentStr] as Record<string, unknown>;
            (node["_errors"] as string[]).push(issue.message);
          } else {
            if (!current[segmentStr]) {
              current[segmentStr] = { _errors: [] as string[] };
            }
            current = current[segmentStr] as Record<string, unknown>;
          }
        }
      }
    }

    return result;
  }
}