// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export const ZodStringFixed = z.ZodString.create().superRefine((val, ctx) => {
  // This is handled below via a custom schema wrapper
});

export function createFixedZodString(): z.ZodEffects<z.ZodString, string, unknown> {
  return z.preprocess((input) => {
    if (input === undefined || input === null) {
      return input;
    }
    return input;
  }, z.string()) as unknown as z.ZodEffects<z.ZodString, string, unknown>;
}

// Core fixed parse function that mirrors ZodString._parse behavior
export function parseStringFixed(
  input: unknown
): { success: true; data: string } | { success: false; error: z.ZodError } {
  try {
    if (input === undefined) {
      const error = new z.ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ZodParsedType.undefined,
          path: [],
          message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
        },
      ]);
      return { success: false, error };
    }

    if (input === null) {
      const error = new z.ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ZodParsedType.null,
          path: [],
          message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.null}`,
        },
      ]);
      return { success: false, error };
    }

    if (!isString(input)) {
      const received = z.getParsedType(input);
      const error = new z.ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received,
          path: [],
          message: `Expected ${ZodParsedType.string}, received ${received}`,
        },
      ]);
      return { success: false, error };
    }

    return { success: true, data: input };
  } catch (error) {
    throw new ServiceError("parseStringFixed operation failed", { cause: error });
  }
}

// Patched ZodString schema using a custom type
export const fixedStringSchema = z.custom<string>((val) => {
  if (val === undefined || val === null) {
    return false;
  }
  return isString(val);
}, {
  message: `Expected string, received undefined`,
});

// Main export: a schema that correctly handles undefined input
export const patchedZodString = z
  .any()
  .superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
        path: [],
        message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.undefined}`,
      });
      return z.NEVER;
    }

    if (val === null) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.null,
        path: [],
        message: `Expected ${ZodParsedType.string}, received ${ZodParsedType.null}`,
      });
      return z.NEVER;
    }

    if (!isString(val)) {
      const received = z.getParsedType(val);
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received,
        path: [],
        message: `Expected ${ZodParsedType.string}, received ${received}`,
      });
      return z.NEVER;
    }
  })
  .transform((val) => val as string);

// Utility to safely parse with the fixed string schema
export async function safeParseString(
  input: unknown
): Promise<{ success: true; data: string } | { success: false; error: z.ZodError }> {
  try {
    const result = patchedZodString.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  } catch (error) {
    throw new ServiceError("safeParseString operation failed", { cause: error });
  }
}

// Direct patch approach: extend ZodString prototype to fix _parse for undefined
const OriginalZodStringParse = (z.ZodString.prototype as unknown as { _parse: (input: z.ParseInput) => z.ParseReturnType<string> })._parse;

(z.ZodString.prototype as unknown as { _parse: (input: z.ParseInput) => z.ParseReturnType<string> })._parse = function (
  this: z.ZodString,
  input: z.ParseInput
): z.ParseReturnType<string> {
  const parsedType = z.getParsedType(input.data);

  if (input.data === undefined) {
    const ctx = this._getOrReturnCtx(input);
    z.addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
    });
    return z.INVALID;
  }

  return OriginalZodStringParse.call(this, input);
};

export { ZodIssueCode, ZodParsedType, ServiceError };