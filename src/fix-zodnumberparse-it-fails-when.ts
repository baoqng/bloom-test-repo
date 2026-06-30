// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

export function fixZodNumberParse(): void {
  const originalParse = (z.ZodNumber.prototype as unknown as Record<string, unknown>)["_parse"];

  (z.ZodNumber.prototype as unknown as Record<string, Function>)["_parse"] = function (
    input: z.ParseInput
  ): z.ParseReturnType<number> {
    try {
      const ctx = this._getOrReturnCtx(input);

      if (typeof input.data !== "number" || isNaN(input.data)) {
        z.addIssueToContext(ctx, {
          code: z.ZodIssueCode.invalid_type,
          expected: z.ZodParsedType.number,
          received: ctx.parsedType,
        });
        return z.INVALID;
      }

      const checks = this._def.checks as Array<{
        kind: string;
        value: number;
        inclusive: boolean;
        message?: string;
      }>;

      let hadError = false;

      for (const check of checks) {
        if (check.kind === "min") {
          const failed = check.inclusive
            ? input.data < check.value
            : input.data <= check.value;

          if (failed) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.too_small,
              type: "number",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message ?? undefined,
            });
            hadError = true;
          }
        } else if (check.kind === "max") {
          const failed = check.inclusive
            ? input.data > check.value
            : input.data >= check.value;

          if (failed) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.too_big,
              type: "number",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message ?? undefined,
            });
            hadError = true;
          }
        } else if (check.kind === "int") {
          if (!Number.isInteger(input.data)) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.invalid_type,
              expected: "integer" as z.ZodParsedType,
              received: "float" as z.ZodParsedType,
              message: (check as unknown as Record<string, unknown>)["message"] as string | undefined,
            });
            hadError = true;
          }
        } else if (check.kind === "multipleOf") {
          const remainder = input.data % check.value;
          if (remainder !== 0) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message ?? undefined,
            });
            hadError = true;
          }
        } else if (check.kind === "finite") {
          if (!Number.isFinite(input.data)) {
            z.addIssueToContext(ctx, {
              code: z.ZodIssueCode.not_finite,
              message: check.message ?? undefined,
            });
            hadError = true;
          }
        }
      }

      if (hadError) {
        return z.INVALID;
      }

      return { status: "valid", value: input.data };
    } catch (error) {
      throw new ServiceError("ZodNumber._parse operation failed", { cause: error });
    }
  };
}

export function createValidatedNumberSchema(
  min?: number,
  max?: number,
  inclusive: boolean = true
): z.ZodNumber {
  try {
    let schema = z.number();

    if (min !== undefined) {
      schema = inclusive ? schema.min(min) : schema.gt(min);
    }

    if (max !== undefined) {
      schema = inclusive ? schema.max(max) : schema.lt(max);
    }

    return schema;
  } catch (error) {
    throw new ServiceError("createValidatedNumberSchema operation failed", { cause: error });
  }
}

export function validateNumberInRange(
  value: unknown,
  min: number,
  max: number
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  try {
    if (value === null || value === undefined) {
      return {
        success: false,
        errors: [
          {
            code: z.ZodIssueCode.invalid_type,
            expected: z.ZodParsedType.number,
            received: z.ZodParsedType.null,
            path: [],
            message: "Value is null or undefined",
          },
        ],
      };
    }

    const schema = z.number().min(min).max(max);
    const result = schema.safeParse(value);

    if (!result.success) {
      return { success: false, errors: result.error.issues };
    }

    return { success: true, data: result.data };
  } catch (error) {
    throw new ServiceError("validateNumberInRange operation failed", { cause: error });
  }
}

fixZodNumberParse();

export { z, ServiceError };