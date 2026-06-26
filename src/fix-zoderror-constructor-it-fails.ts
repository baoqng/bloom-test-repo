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

    const message = issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
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

  format(): Record<string, unknown> {
    const formatted: Record<string, unknown> = { _errors: [] as string[] };

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        (formatted["_errors"] as string[]).push(issue.message);
      } else {
        let current = formatted;
        for (let i = 0; i < issue.path.length; i++) {
          const key = String(issue.path[i]);
          if (i === issue.path.length - 1) {
            if (current[key] === undefined || current[key] === null) {
              current[key] = { _errors: [] as string[] };
            }
            if (typeof current[key] === "object" && current[key] !== null) {
              const node = current[key] as Record<string, unknown>;
              if (!Array.isArray(node["_errors"])) {
                node["_errors"] = [] as string[];
              }
              (node["_errors"] as string[]).push(issue.message);
            }
          } else {
            if (current[key] === undefined || current[key] === null) {
              current[key] = { _errors: [] as string[] };
            }
            current = current[key] as Record<string, unknown>;
          }
        }
      }
    }

    return formatted;
  }

  flatten(): { formErrors: string[]; fieldErrors: Record<string, string[]> } {
    const formErrors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      if (issue.path.length === 0) {
        formErrors.push(issue.message);
      } else {
        const key = String(issue.path[0]);
        if (fieldErrors[key] === undefined) {
          fieldErrors[key] = [];
        }
        fieldErrors[key].push(issue.message);
      }
    }

    return { formErrors, fieldErrors };
  }

  toString(): string {
    return `ZodError: ${this.message}`;
  }

  static isInstance(value: unknown): value is ZodError {
    return value instanceof ZodError;
  }
}