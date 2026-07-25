// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

export function createSafeStringSchema(): z.ZodString {
  return z.string();
}

export function parseString(input: unknown): z.SafeParseReturnType<unknown, string> {
  const schema = z.string();
  return schema.safeParse(input);
}

export function safeParsed(input: unknown): string {
  if (input === undefined || input === null) {
    throw new Error(
      `Validation failed: expected string, received ${input === undefined ? ZodParsedType.undefined : ZodParsedType.null}`
    );
  }
  const result = z.string().safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`Validation failed: ${issue?.message ?? "invalid input"}`);
  }
  return result.data;
}

export class ZodStringParser {
  private schema: z.ZodString;

  constructor() {
    this.schema = z.string();
  }

  parse(input: unknown): string {
    if (input === undefined) {
      const ctx = new z.ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ZodParsedType.undefined,
          path: [],
          message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
        },
      ]);
      throw ctx;
    }
    try {
      return this.schema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error;
      }
      throw new Error(`Parse failed: ${String(error)}`);
    }
  }

  safeParse(input: unknown): z.SafeParseReturnType<unknown, string> {
    if (input === undefined) {
      return {
        success: false,
        error: new z.ZodError([
          {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ZodParsedType.undefined,
            path: [],
            message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
          },
        ]),
      };
    }
    return this.schema.safeParse(input);
  }
}

export function fixedZodStringParse(input: unknown): z.SafeParseReturnType<unknown, string> {
  if (input === undefined) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ZodParsedType.undefined,
          path: [],
          message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
        },
      ]),
    };
  }

  return z.string().safeParse(input);
}

export function validateStringInput(data: unknown): {
  success: boolean;
  data?: string;
  error?: z.ZodError;
} {
  if (data === undefined) {
    const zodError = new z.ZodError([
      {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
        path: [],
        message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
      },
    ]);
    return { success: false, error: zodError };
  }

  const result = z.string().safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}

export { ZodIssueCode, ZodParsedType, z };