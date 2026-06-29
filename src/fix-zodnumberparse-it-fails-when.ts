// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

function parseZodNumber(def: z.ZodNumberDef, input: { data: unknown }): { success: boolean; issues: z.ZodIssue[] } {
  const issues: z.ZodIssue[] = [];

  if (typeof input.data !== "number" || isNaN(input.data)) {
    issues.push({
      code: z.ZodIssueCode.invalid_type,
      expected: "number",
      received: input.data === null ? "null" : (typeof input.data as z.ZodParsedType),
      path: [],
      message: "Expected number, received " + (input.data === null ? "null" : typeof input.data),
    });
    return { success: false, issues };
  }

  const value = input.data as number;

  for (const check of def.checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive ? value < check.value : value <= check.value;
      if (tooSmall) {
        issues.push({
          code: z.ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          exact: false,
          path: [],
          message: check.message ?? `Number must be greater than${check.inclusive ? " or equal to" : ""} ${check.value}`,
        });
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive ? value > check.value : value >= check.value;
      if (tooBig) {
        issues.push({
          code: z.ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          exact: false,
          path: [],
          message: check.message ?? `Number must be less than${check.inclusive ? " or equal to" : ""} ${check.value}`,
        });
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(value)) {
        issues.push({
          code: z.ZodIssueCode.invalid_type,
          expected: "integer",
          received: "float",
          path: [],
          message: check.message ?? "Expected integer, received float",
        });
      }
    } else if (check.kind === "multipleOf") {
      if (value % check.value !== 0) {
        issues.push({
          code: z.ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          path: [],
          message: check.message ?? `Number must be a multiple of ${check.value}`,
        });
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(value)) {
        issues.push({
          code: z.ZodIssueCode.not_finite,
          path: [],
          message: check.message ?? "Number must be finite",
        });
      }
    }
  }

  return { success: issues.length === 0, issues };
}

function validateZodNumber(schema: z.ZodNumber, value: unknown): z.SafeParseReturnType<number, number> {
  try {
    const def = schema._def as z.ZodNumberDef;
    const result = parseZodNumber(def, { data: value });

    if (!result.success) {
      return {
        success: false,
        error: new z.ZodError(result.issues),
      };
    }

    return {
      success: true,
      data: value as number,
    };
  } catch (error) {
    throw new ServiceError("validateZodNumber operation failed", { cause: error });
  }
}

export { parseZodNumber, validateZodNumber, ServiceError };