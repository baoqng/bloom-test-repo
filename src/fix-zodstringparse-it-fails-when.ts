// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

type ParseInput = {
  data: unknown;
  path: (string | number)[];
  parent: z.ParseContext;
};

export function parseZodString(input: ParseInput): z.ParseReturnType<string> {
  const ctx = input.parent;

  if (input.data === undefined) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
      path: input.path,
      message: `Expected string, received undefined`,
    });
    return z.INVALID;
  }

  if (typeof input.data !== "string") {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: z.getParsedType(input.data),
      path: input.path,
      message: `Expected string, received ${z.getParsedType(input.data)}`,
    });
    return z.INVALID;
  }

  return { status: "valid", value: input.data };
}

export function createSafeStringSchema(): z.ZodString {
  return z.string();
}

export function validateString(value: unknown): z.SafeParseReturnType<unknown, string> {
  const schema = z.string();
  return schema.safeParse(value);
}

export function parseStringWithUndefinedGuard(value: unknown): string {
  if (value === undefined) {
    throw new z.ZodError([
      {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
        path: [],
        message: `Expected string, received undefined`,
      },
    ]);
  }

  const result = z.string().safeParse(value);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

export class SafeZodStringParser {
  private schema: z.ZodString;

  constructor(schema?: z.ZodString) {
    this.schema = schema ?? z.string();
  }

  parse(value: unknown): string {
    if (value === undefined) {
      throw new z.ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ZodParsedType.undefined,
          path: [],
          message: `Expected string, received undefined`,
        },
      ]);
    }

    return this.schema.parse(value);
  }

  safeParse(value: unknown): z.SafeParseReturnType<unknown, string> {
    if (value === undefined) {
      const error = new z.ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ZodParsedType.undefined,
          path: [],
          message: `Expected string, received undefined`,
        },
      ]);
      return {
        success: false,
        error,
      };
    }

    return this.schema.safeParse(value);
  }
}

export function fixedZodStringParse(
  value: unknown,
  options?: { path?: (string | number)[] }
): z.SafeParseReturnType<unknown, string> {
  const path = options?.path ?? [];

  if (value === undefined) {
    const error = new z.ZodError([
      {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
        path,
        message: `Expected string, received undefined`,
      },
    ]);
    return { success: false, error };
  }

  if (typeof value !== "string") {
    const received = z.getParsedType(value);
    const error = new z.ZodError([
      {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received,
        path,
        message: `Expected string, received ${received}`,
      },
    ]);
    return { success: false, error };
  }

  return { success: true, data: value };
}

export { ZodIssueCode, ZodParsedType };