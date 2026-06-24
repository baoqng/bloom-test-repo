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
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }

    super(firstIssue.message);

    this.issues = [...issues];
    this.name = "ZodError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZodError);
    }
  }

  get message(): string {
    return this.issues
      .map((issue) => {
        const path =
          issue.path && issue.path.length > 0
            ? `[${issue.path.join(".")}]: `
            : "";
        return `${path}${issue.message}`;
      })
      .join("; ");
  }

  public addIssue(issue: ZodIssue): void {
    if (issue === undefined || issue === null) {
      throw new TypeError("Cannot add a null or undefined issue to ZodError");
    }
    (this.issues as ZodIssue[]).push(issue);
  }

  public addIssues(issues: ZodIssue[]): void {
    if (!issues || issues.length === 0) {
      throw new TypeError(
        "ZodError.addIssues requires at least one issue; got empty array"
      );
    }
    for (const issue of issues) {
      this.addIssue(issue);
    }
  }

  public flatten(): {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  } {
    const formErrors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of this.issues) {
      if (!issue.path || issue.path.length === 0) {
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

  public format(): Record<string, { _errors: string[] }> {
    const result: Record<string, { _errors: string[] }> = {
      _root: { _errors: [] },
    };

    for (const issue of this.issues) {
      if (!issue.path || issue.path.length === 0) {
        result["_root"]._errors.push(issue.message);
      } else {
        const key = issue.path.join(".");
        if (result[key] === undefined) {
          result[key] = { _errors: [] };
        }
        result[key]._errors.push(issue.message);
      }
    }

    return result;
  }

  public toString(): string {
    return `ZodError: ${this.message}`;
  }

  public toJSON(): { name: string; issues: ZodIssue[]; message: string } {
    return {
      name: this.name,
      issues: this.issues,
      message: this.message,
    };
  }

  public static isInstance(value: unknown): value is ZodError {
    return value instanceof ZodError;
  }

  public static create(issues: ZodIssue[]): ZodError {
    if (!issues || issues.length === 0) {
      throw new TypeError(
        "ZodError requires at least one issue; got empty array"
      );
    }
    return new ZodError(issues);
  }
}