// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

export function parseNumber(
  schema: z.ZodNumber,
  value: unknown
): z.SafeParseReturnType<number> {
  return schema.safeParse(value);
}

export function createNumberSchema(
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  } = {}
): z.ZodNumber {
  let schema = z.number();

  if (options.min !== undefined) {
    const min = options.min;
    if (min.inclusive) {
      schema = min.message !== undefined
        ? schema.min(min.value, { message: min.message })
        : schema.min(min.value);
    } else {
      schema = min.message !== undefined
        ? schema.gt(min.value, { message: min.message })
        : schema.gt(min.value);
    }
  }

  if (options.max !== undefined) {
    const max = options.max;
    if (max.inclusive) {
      schema = max.message !== undefined
        ? schema.max(max.value, { message: max.message })
        : schema.max(max.value);
    } else {
      schema = max.message !== undefined
        ? schema.lt(max.value, { message: max.message })
        : schema.lt(max.value);
    }
  }

  return schema;
}

export function validateNumberWithChecks(
  data: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  >
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  if (typeof data !== "number" || isNaN(data)) {
    return {
      success: false,
      errors: [
        {
          code: ZodIssueCode.invalid_type,
          expected: "number" as z.ZodParsedType,
          received: (typeof data === "number" ? "nan" : typeof data) as z.ZodParsedType,
          path: [],
          message: "Expected number, received " + typeof data,
        },
      ],
    };
  }

  const issues: z.ZodIssue[] = [];

  for (const check of checks) {
    if (check.kind === "min") {
      if (check.inclusive ? data < check.value : data <= check.value) {
        issues.push({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? (check.inclusive
            ? `Number must be greater than or equal to ${check.value}`
            : `Number must be greater than ${check.value}`),
          path: [],
        });
      }
    }

    if (check.kind === "max") {
      if (check.inclusive ? data > check.value : data >= check.value) {
        issues.push({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? (check.inclusive
            ? `Number must be less than or equal to ${check.value}`
            : `Number must be less than ${check.value}`),
          path: [],
        });
      }
    }

    if (check.kind === "int") {
      if (!Number.isInteger(data)) {
        issues.push({
          code: ZodIssueCode.invalid_type,
          expected: "integer" as z.ZodParsedType,
          received: "float" as z.ZodParsedType,
          message: check.message ?? "Expected integer, received float",
          path: [],
        });
      }
    }

    if (check.kind === "multipleOf") {
      if (data % check.value !== 0) {
        issues.push({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message ?? `Number must be a multiple of ${check.value}`,
          path: [],
        });
      }
    }

    if (check.kind === "finite") {
      if (!Number.isFinite(data)) {
        issues.push({
          code: ZodIssueCode.not_finite,
          message: check.message ?? "Number must be finite",
          path: [],
        });
      }
    }
  }

  if (issues.length > 0) {
    return { success: false, errors: issues };
  }

  return { success: true, data };
}

export function applyMinCheck(
  data: number,
  value: number,
  inclusive: boolean
): boolean {
  if (inclusive ? data < value : data <= value) {
    return false;
  }
  return true;
}

export function applyMaxCheck(
  data: number,
  value: number,
  inclusive: boolean
): boolean {
  if (inclusive ? data > value : data >= value) {
    return false;
  }
  return true;
}

export function isWithinRange(
  data: number,
  min: number,
  max: number,
  inclusiveMin = true,
  inclusiveMax = true
): boolean {
  const minValid = inclusiveMin ? data >= min : data > min;
  const maxValid = inclusiveMax ? data <= max : data < max;
  return minValid && maxValid;
}