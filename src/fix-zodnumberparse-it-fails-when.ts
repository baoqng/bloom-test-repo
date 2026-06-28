// bloom-deps: zod@^3

import { z } from "zod";

function parseNumber(schema: z.ZodNumber, input: unknown): z.SafeParseReturnType<number, number> {
  return schema.safeParse(input);
}

function createNumberSchema(
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  >
): z.ZodNumber {
  let schema = z.number();

  for (const check of checks) {
    if (check.kind === "min") {
      if (check.inclusive) {
        schema = schema.min(check.value, check.message);
      } else {
        schema = schema.gt(check.value, check.message);
      }
    } else if (check.kind === "max") {
      if (check.inclusive) {
        schema = schema.max(check.value, check.message);
      } else {
        schema = schema.lt(check.value, check.message);
      }
    } else if (check.kind === "int") {
      schema = schema.int(check.message);
    } else if (check.kind === "multipleOf") {
      schema = schema.multipleOf(check.value, check.message);
    } else if (check.kind === "finite") {
      schema = schema.finite(check.message);
    }
  }

  return schema;
}

function validateNumber(
  value: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  >
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  const schema = createNumberSchema(checks);
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error.issues };
}

function isValidMinCheck(inputData: number, checkValue: number, inclusive: boolean): boolean {
  if (inclusive) {
    return inputData >= checkValue;
  }
  return inputData > checkValue;
}

function isValidMaxCheck(inputData: number, checkValue: number, inclusive: boolean): boolean {
  if (inclusive) {
    return inputData <= checkValue;
  }
  return inputData < checkValue;
}

function runMinCheck(inputData: number, checkValue: number, inclusive: boolean): boolean {
  const fails = inclusive ? inputData < checkValue : inputData <= checkValue;
  return !fails;
}

function runMaxCheck(inputData: number, checkValue: number, inclusive: boolean): boolean {
  const fails = inclusive ? inputData > checkValue : inputData >= checkValue;
  return !fails;
}

interface NumberCheckResult {
  valid: boolean;
  issues: Array<{
    code: "too_small" | "too_big";
    type: "number";
    minimum?: number;
    maximum?: number;
    inclusive: boolean;
    message: string;
  }>;
}

function validateNumberChecks(
  inputData: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
  >
): NumberCheckResult {
  if (typeof inputData !== "number") {
    return {
      valid: false,
      issues: [
        {
          code: "too_small",
          type: "number",
          inclusive: false,
          message: "Expected number",
        },
      ],
    };
  }

  const issues: NumberCheckResult["issues"] = [];

  for (const check of checks) {
    if (check.kind === "min") {
      const fails = check.inclusive
        ? inputData < check.value
        : inputData <= check.value;

      if (fails) {
        issues.push({
          code: "too_small",
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message:
            check.message ??
            (check.inclusive
              ? `Number must be greater than or equal to ${check.value}`
              : `Number must be greater than ${check.value}`),
        });
      }
    } else if (check.kind === "max") {
      const fails = check.inclusive
        ? inputData > check.value
        : inputData >= check.value;

      if (fails) {
        issues.push({
          code: "too_big",
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message:
            check.message ??
            (check.inclusive
              ? `Number must be less than or equal to ${check.value}`
              : `Number must be less than ${check.value}`),
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function parseAndValidateNumber(
  rawValue: unknown
): { success: true; value: number } | { success: false; error: string } {
  if (typeof rawValue === "string") {
    const trimmed = rawValue.trim();
    if (trimmed === "" || trimmed === null) {
      return { success: false, error: "Value cannot be empty" };
    }
    const parsed = Number(trimmed);
    if (isNaN(parsed)) {
      return { success: false, error: `Invalid number: ${trimmed}` };
    }
    return { success: true, value: parsed };
  }

  if (typeof rawValue === "number") {
    if (isNaN(rawValue)) {
      return { success: false, error: "Value is NaN" };
    }
    return { success: true, value: rawValue };
  }

  if (rawValue === null || rawValue === undefined) {
    return { success: false, error: "Value is null or undefined" };
  }

  return { success: false, error: `Expected number, got ${typeof rawValue}` };
}

export {
  parseNumber,
  createNumberSchema,
  validateNumber,
  isValidMinCheck,
  isValidMaxCheck,
  runMinCheck,
  runMaxCheck,
  validateNumberChecks,
  parseAndValidateNumber,
};

export type { NumberCheckResult };