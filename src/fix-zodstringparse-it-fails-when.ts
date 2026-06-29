// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

export function createSafeStringSchema(): z.ZodString {
  const base = z.string();

  const originalParse = base._parse.bind(base);

  const patchedSchema = Object.create(base) as z.ZodString;

  patchedSchema._parse = function (
    input: z.ParseInput
  ): z.ParseReturnType<string> {
    if (input.data === undefined) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return z.INVALID;
    }
    return originalParse(input);
  };

  return patchedSchema;
}

export function patchZodString(): void {
  const originalParse = z.ZodString.prototype._parse;

  z.ZodString.prototype._parse = function (
    input: z.ParseInput
  ): z.ParseReturnType<string> {
    if (input.data === undefined) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return z.INVALID;
    }
    return originalParse.call(this, input);
  };
}

patchZodString();

export function parseStringInput(
  input: unknown
): { success: true; data: string } | { success: false; error: ServiceError } {
  if (input === undefined) {
    return {
      success: false,
      error: new ServiceError("Input is undefined, expected a string", {
        cause: new Error("received undefined instead of string"),
      }),
    };
  }

  const schema = z.string();
  const result = schema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: new ServiceError("String validation failed", {
        cause: result.error,
      }),
    };
  }

  return { success: true, data: result.data };
}

export function validateStringWithUndefinedGuard(
  input: unknown
): z.SafeParseReturnType<unknown, string> {
  const schema = z.string();
  return schema.safeParse(input);
}

export async function processStringInput(input: unknown): Promise<string> {
  try {
    if (input === undefined) {
      throw new ServiceError("Input must not be undefined", {
        cause: new Error("received undefined"),
      });
    }

    const schema = z.string().min(1).max(10000);
    const result = schema.safeParse(input);

    if (!result.success) {
      throw new ServiceError("Invalid string input", {
        cause: result.error,
      });
    }

    return result.data;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError("Failed to process string input", { cause: error });
  }
}

export { z, ZodIssueCode, ZodParsedType };