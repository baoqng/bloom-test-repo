```typescript
import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

type ParseInput = {
  data: unknown;
  path: (string | number)[];
  parent: ParseContext;
};

type ParseContext = {
  issues: z.ZodIssue[];
  addIssue: (issue: z.ZodIssueOptionalMessage) => void;
};

type ParseReturnType<T> =
  | { status: "valid"; value: T }
  | { status: "invalid" };

const INVALID: ParseReturnType<never> = { status: "invalid" };

function makeValid<T>(value: T): ParseReturnType<T> {
  return { status: "valid", value };
}

export class ZodString {
  private _minLength: number | null = null;
  private _maxLength: number | null = null;

  _parse(input: ParseInput): ParseReturnType<string> {
    const ctx = input.parent;

    if (input.data === undefined) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
        path: input.path,
        message: `Expected string, received undefined`,
      } as z.ZodIssue);
      return INVALID;
    }

    if (typeof input.data !== "string") {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: typeof input.data as z.ZodParsedType,
        path: input.path,
        message: `Expected string, received ${typeof input.data}`,
      } as z.ZodIssue);
      return INVALID;
    }

    const data: string = input.data;

    if (this._minLength !== null && data.length < this._minLength) {
      ctx.addIssue({
        code: ZodIssueCode.too_small,
        minimum: this._minLength,
        type: "string",
        inclusive: true,
        message: `String must contain at least ${this._minLength} character(s)`,
        path: input.path,
      } as unknown as z.ZodIssue);
      return INVALID;
    }

    if (this._maxLength !== null && data.length > this._maxLength) {
      ctx.addIssue({
        code: ZodIssueCode.too_big,
        maximum: this._maxLength,
        type: "string",
        inclusive: true,
        message: `String must contain at most ${this._maxLength} character(s)`,
        path: input.path,
      } as unknown as z.ZodIssue);
      return INVALID;
    }

    return makeValid(data);
  }

  min(minLength: number): this {
    this._minLength = minLength;
    return this;
  }

  max(maxLength: number): this {
    this._maxLength = maxLength;
    return this;
  }

  parse(data: unknown): string {
    const issues: z.ZodIssue[] = [];

    const ctx: ParseContext = {
      issues,
      addIssue(issue: z.ZodIssueOptionalMessage) {
        issues.push(issue as z.ZodIssue);
      },
    };

    const input: ParseInput = {
      data,
      path: [],
      parent: ctx,
    };

    const result = this._parse(input);

    if (result.status === "invalid") {
      throw new z.ZodError(issues);
    }

    if (result.status === "valid" && result.value !== null) {
      return result.value;
    }

    throw new z.ZodError(issues);
  }

  safeParse(data: unknown): { success: true; data: string } | { success: false; error: z.ZodError } {
    try {
      const value = this.parse(data);
      return { success: true, data: value };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error };
      }
      throw new Error("Unexpected error during parsing", { cause: error });
    }
  }
}

export function zodString(): ZodString {
  return new ZodString();
}
```