// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

export function createSafeStringSchema(): z.ZodString {
  return z.string();
}

export function parseStringInput(input: unknown): z.SafeParseReturnType<string, string> {
  const schema = z.string();
  return schema.safeParse(input);
}

export function patchedStringParse(input: unknown): { success: true; data: string } | { success: false; error: z.ZodError } {
  if (input === undefined) {
    const issue: z.ZodIssue = {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
      path: [],
      message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
    };
    const error = new z.ZodError([issue]);
    return { success: false, error };
  }

  if (input === null) {
    const issue: z.ZodIssue = {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.null,
      path: [],
      message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.null}`,
    };
    const error = new z.ZodError([issue]);
    return { success: false, error };
  }

  const schema = z.string();
  return schema.safeParse(input);
}

export function getParsedType(value: unknown): z.ZodParsedType {
  if (value === undefined) return ZodParsedType.undefined;
  if (value === null) return ZodParsedType.null;
  if (typeof value === "string") return ZodParsedType.string;
  if (typeof value === "number") return ZodParsedType.number;
  if (typeof value === "boolean") return ZodParsedType.boolean;
  if (typeof value === "bigint") return ZodParsedType.bigint;
  if (typeof value === "symbol") return ZodParsedType.symbol;
  if (typeof value === "function") return ZodParsedType.function;
  if (Array.isArray(value)) return ZodParsedType.array;
  if (value instanceof Date) return ZodParsedType.date;
  if (typeof value === "object") return ZodParsedType.object;
  return ZodParsedType.unknown;
}

export class FixedZodString {
  private minLength: number | null = null;
  private maxLength: number | null = null;

  min(length: number): this {
    this.minLength = length;
    return this;
  }

  max(length: number): this {
    this.maxLength = length;
    return this;
  }

  parse(inputData: unknown): { success: true; data: string } | { success: false; error: z.ZodError } {
    if (inputData === undefined) {
      const issue: z.ZodIssue = {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
        path: [],
        message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
      };
      const error = new z.ZodError([issue]);
      return { success: false, error };
    }

    if (inputData === null) {
      const issue: z.ZodIssue = {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.null,
        path: [],
        message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.null}`,
      };
      const error = new z.ZodError([issue]);
      return { success: false, error };
    }

    if (typeof inputData !== "string") {
      const receivedType = getParsedType(inputData);
      const issue: z.ZodIssue = {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: receivedType,
        path: [],
        message: `Expected ${ZodParsedType.string}, received ${receivedType}`,
      };
      const error = new z.ZodError([issue]);
      return { success: false, error };
    }

    const issues: z.ZodIssue[] = [];

    if (this.minLength !== null && inputData.length < this.minLength) {
      const issue: z.ZodIssue = {
        code: ZodIssueCode.too_small,
        minimum: this.minLength,
        type: "string",
        inclusive: true,
        exact: false,
        path: [],
        message: `String must contain at least ${this.minLength} character(s)`,
      };
      issues.push(issue);
    }

    if (this.maxLength !== null && inputData.length > this.maxLength) {
      const issue: z.ZodIssue = {
        code: ZodIssueCode.too_big,
        maximum: this.maxLength,
        type: "string",
        inclusive: true,
        exact: false,
        path: [],
        message: `String must contain at most ${this.maxLength} character(s)`,
      };
      issues.push(issue);
    }

    if (issues.length > 0) {
      return { success: false, error: new z.ZodError(issues) };
    }

    return { success: true, data: inputData };
  }
}

export function fixedStringParse(
  inputData: unknown,
  ctx: { addIssue: (issue: z.ZodIssueOptionalMessage) => void }
): typeof z.NEVER | string {
  if (inputData === undefined) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
    });
    return z.NEVER;
  }

  if (inputData === null) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.null,
    });
    return z.NEVER;
  }

  if (typeof inputData !== "string") {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: getParsedType(inputData),
    });
    return z.NEVER;
  }

  return inputData;
}

export const fixedStringSchema = z.custom<string>((val) => {
  return typeof val === "string";
}, {
  message: `Expected string`,
}).transform((val, ctx) => {
  return fixedStringParse(val, ctx);
});

export function createStringValidator() {
  return z.preprocess((val) => {
    if (val === undefined) return val;
    if (val === null) return val;
    return val;
  }, z.string());
}

export default {
  patchedStringParse,
  fixedStringParse,
  FixedZodString,
  getParsedType,
  createSafeStringSchema,
  parseStringInput,
  createStringValidator,
};