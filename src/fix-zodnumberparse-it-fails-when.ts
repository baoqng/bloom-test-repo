// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

export function parseNumber(schema: z.ZodNumber, value: unknown): number {
  try {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new ServiceError("validation failed", { cause: result.error });
    }
    return result.data;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError("operation failed", { cause: error });
  }
}

function isZodNumber(schema: unknown): schema is z.ZodNumber {
  return (
    schema !== null &&
    schema !== undefined &&
    typeof schema === "object" &&
    "_def" in schema &&
    (schema as z.ZodNumber)._def?.typeName === z.ZodFirstPartyTypeKind.ZodNumber
  );
}

export function validateNumberWithChecks(
  value: unknown,
  checks: z.ZodNumberCheck[]
): z.ZodIssue[] {
  try {
    if (typeof value !== "number" || isNaN(value)) {
      return [
        {
          code: ZodIssueCode.invalid_type,
          expected: "number",
          received: typeof value as z.ZodParsedType,
          path: [],
          message: "Expected number",
        },
      ];
    }

    const issues: z.ZodIssue[] = [];

    for (const check of checks) {
      if (check === null || check === undefined) continue;

      if (check.kind === "min") {
        const minValue = check.value;
        const inclusive = check.inclusive;
        const violated = inclusive ? value < minValue : value <= minValue;
        if (violated) {
          issues.push({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: minValue,
            inclusive: inclusive,
            message:
              check.message !== null && check.message !== undefined
                ? check.message
                : `Number must be greater than${inclusive ? " or equal to" : ""} ${minValue}`,
            path: [],
          });
        }
      } else if (check.kind === "max") {
        const maxValue = check.value;
        const inclusive = check.inclusive;
        const violated = inclusive ? value > maxValue : value >= maxValue;
        if (violated) {
          issues.push({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: maxValue,
            inclusive: inclusive,
            message:
              check.message !== null && check.message !== undefined
                ? check.message
                : `Number must be less than${inclusive ? " or equal to" : ""} ${maxValue}`,
            path: [],
          });
        }
      }
    }

    return issues;
  } catch (error) {
    throw new ServiceError("operation failed", { cause: error });
  }
}

export function buildNumberSchema(
  checks: z.ZodNumberCheck[]
): z.ZodNumber {
  try {
    let schema = z.number();

    for (const check of checks) {
      if (check === null || check === undefined) continue;

      if (check.kind === "min") {
        const minValue = check.value;
        const inclusive = check.inclusive;
        const msg =
          check.message !== null && check.message !== undefined
            ? check.message
            : undefined;
        if (inclusive) {
          schema = msg !== undefined ? schema.min(minValue, msg) : schema.min(minValue);
        } else {
          schema = msg !== undefined ? schema.gt(minValue, msg) : schema.gt(minValue);
        }
      } else if (check.kind === "max") {
        const maxValue = check.value;
        const inclusive = check.inclusive;
        const msg =
          check.message !== null && check.message !== undefined
            ? check.message
            : undefined;
        if (inclusive) {
          schema = msg !== undefined ? schema.max(maxValue, msg) : schema.max(maxValue);
        } else {
          schema = msg !== undefined ? schema.lt(maxValue, msg) : schema.lt(maxValue);
        }
      }
    }

    return schema;
  } catch (error) {
    throw new ServiceError("operation failed", { cause: error });
  }
}

export function zodNumberParse(
  schema: z.ZodNumber,
  value: unknown
): { success: true; data: number } | { success: false; issues: z.ZodIssue[] } {
  try {
    if (!isZodNumber(schema)) {
      return {
        success: false,
        issues: [
          {
            code: ZodIssueCode.custom,
            message: "Invalid schema",
            path: [],
          },
        ],
      };
    }

    if (typeof value !== "number" || isNaN(value)) {
      return {
        success: false,
        issues: [
          {
            code: ZodIssueCode.invalid_type,
            expected: "number" as z.ZodParsedType,
            received: (typeof value) as z.ZodParsedType,
            path: [],
            message: "Expected number",
          },
        ],
      };
    }

    const def = schema._def;
    if (def === null || def === undefined) {
      return { success: true, data: value };
    }

    const checks = def.checks;
    if (!Array.isArray(checks)) {
      return { success: true, data: value };
    }

    const issues = validateNumberWithChecks(value, checks);

    if (issues.length > 0) {
      return { success: false, issues };
    }

    return { success: true, data: value };
  } catch (error) {
    throw new ServiceError("operation failed", { cause: error });
  }
}

export { z, isZodNumber };