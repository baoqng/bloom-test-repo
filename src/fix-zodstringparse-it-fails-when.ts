// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

type ZodStringInput = {
  data: unknown;
};

type ParseContext = {
  addIssue: (issue: z.ZodIssueOptionalMessage) => void;
  readonly common: {
    readonly issues: z.ZodIssue[];
  };
};

const INVALID = z.INVALID;

function zodStringParse(input: ZodStringInput, ctx: ParseContext): z.ParseReturnType<string> {
  if (input.data === undefined) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
    });
    return INVALID;
  }

  if (typeof input.data !== "string") {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: z.getParsedType(input.data),
    });
    return INVALID;
  }

  return { status: "valid", value: input.data };
}

export { zodStringParse };

export function createSafeStringSchema(): z.ZodString {
  return z.string();
}

export function parseStringInput(value: unknown): { success: true; data: string } | { success: false; errors: { field: string; message: string; code: string }[] } {
  const schema = z.string();
  const result = schema.safeParse(value);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "value",
      message: issue.message,
      code: issue.code,
    }));
    return { success: false, errors };
  }

  return { success: true, data: result.data };
}

export function validateStringField(
  fieldName: string,
  value: unknown,
  options?: { maxLength?: number; minLength?: number; format?: RegExp }
): { valid: true; value: string } | { valid: false; error: { field: string; message: string; code: string } } {
  if (value === undefined) {
    return {
      valid: false,
      error: {
        field: fieldName,
        message: `${fieldName} is required`,
        code: ZodIssueCode.invalid_type,
      },
    };
  }

  if (typeof value !== "string") {
    return {
      valid: false,
      error: {
        field: fieldName,
        message: `${fieldName} must be a string`,
        code: ZodIssueCode.invalid_type,
      },
    };
  }

  const maxLength = options?.maxLength ?? undefined;
  const minLength = options?.minLength ?? undefined;
  const format = options?.format ?? undefined;

  if (minLength !== undefined && value.length < minLength) {
    return {
      valid: false,
      error: {
        field: fieldName,
        message: `${fieldName} must be at least ${minLength} characters`,
        code: ZodIssueCode.too_small,
      },
    };
  }

  if (maxLength !== undefined && value.length > maxLength) {
    return {
      valid: false,
      error: {
        field: fieldName,
        message: `${fieldName} must be at most ${maxLength} characters`,
        code: ZodIssueCode.too_big,
      },
    };
  }

  if (format !== undefined && !format.test(value)) {
    return {
      valid: false,
      error: {
        field: fieldName,
        message: `${fieldName} has invalid format`,
        code: ZodIssueCode.invalid_string,
      },
    };
  }

  return { valid: true, value };
}

export class ZodStringParser {
  private schema: z.ZodString;

  constructor(schema?: z.ZodString) {
    this.schema = schema ?? z.string();
  }

  parse(input: unknown): { success: true; data: string } | { success: false; errors: { field: string; message: string; code: string }[] } {
    if (input === undefined) {
      return {
        success: false,
        errors: [
          {
            field: "value",
            message: "Expected string, received undefined",
            code: ZodIssueCode.invalid_type,
          },
        ],
      };
    }

    const result = this.schema.safeParse(input);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "value",
        message: issue.message,
        code: issue.code,
      }));
      return { success: false, errors };
    }

    return { success: true, data: result.data };
  }
}