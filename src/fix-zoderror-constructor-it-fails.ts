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

    const message = issues.map((issue) => issue.message).join("; ");
    super(message);

    this.name = "ZodError";
    this.issues = issues;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodError);
    }
  }

  get firstIssue(): ZodIssue {
    return this.issues[0];
  }

  toString(): string {
    return `ZodError: ${this.issues.map((issue) => issue.message).join("; ")}`;
  }
}