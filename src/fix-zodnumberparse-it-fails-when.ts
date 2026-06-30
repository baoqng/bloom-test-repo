// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

export function createZodNumberWithBoundaryChecks() {
  return z.number();
}

export function parseNumberWithChecks(
  schema: z.ZodNumber,
  value: unknown
): { success: true; data: number } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

function isZodNumberDef(def: unknown): def is {
  checks: Array<{
    kind: string;
    value?: number;
    inclusive?: boolean;
    message?: string;
  }>;
} {
  if (typeof def !== "object" || def === null) return false;
  const d = def as Record<string, unknown>;
  return Array.isArray(d["checks"]);
}

export function validateNumericRange(
  input: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: string; [key: string]: unknown }
  >
): { valid: boolean; issues: z.ZodIssue[] } {
  if (typeof input !== "number" || isNaN(input)) {
    return {
      valid: false,
      issues: [
        {
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: typeof input === "number" ? "nan" : (typeof input as z.ZodIssueCode),
          path: [],
          message: "Expected number",
        } as z.ZodIssue,
      ],
    };
  }

  const issues: z.ZodIssue[] = [];

  for (const check of checks) {
    if (check.kind === "min") {
      const minCheck = check as {
        kind: "min";
        value: number;
        inclusive: boolean;
        message?: string;
      };
      if (
        minCheck.inclusive
          ? input < minCheck.value
          : input <= minCheck.value
      ) {
        issues.push({
          code: z.ZodIssueCode.too_small,
          type: "number",
          minimum: minCheck.value,
          inclusive: minCheck.inclusive,
          path: [],
          message: minCheck.message ?? `Number must be greater than ${minCheck.inclusive ? "or equal to " : ""}${minCheck.value}`,
        } as z.ZodIssue);
      }
    } else if (check.kind === "max") {
      const maxCheck = check as {
        kind: "max";
        value: number;
        inclusive: boolean;
        message?: string;
      };
      if (
        maxCheck.inclusive
          ? input > maxCheck.value
          : input >= maxCheck.value
      ) {
        issues.push({
          code: z.ZodIssueCode.too_big,
          type: "number",
          maximum: maxCheck.value,
          inclusive: maxCheck.inclusive,
          path: [],
          message: maxCheck.message ?? `Number must be less than ${maxCheck.inclusive ? "or equal to " : ""}${maxCheck.value}`,
        } as z.ZodIssue);
      }
    }
  }

  return { valid: issues.length === 0, issues };
}

export function buildNumberSchema(options: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
}): z.ZodNumber {
  let schema = z.number();

  if (options.min !== null && options.min !== undefined) {
    const min = options.min;
    if (min.inclusive) {
      schema = schema.min(min.value, min.message);
    } else {
      schema = schema.gt(min.value, min.message);
    }
  }

  if (options.max !== null && options.max !== undefined) {
    const max = options.max;
    if (max.inclusive) {
      schema = schema.max(max.value, max.message);
    } else {
      schema = schema.lt(max.value, max.message);
    }
  }

  return schema;
}

export function zodNumberParse(
  schema: z.ZodNumber,
  input: unknown
): { success: true; data: number } | { success: false; issues: z.ZodIssue[] } {
  try {
    if (typeof input !== "number" || isNaN(input)) {
      return {
        success: false,
        issues: [
          {
            code: z.ZodIssueCode.invalid_type,
            expected: "number",
            received: input === null
              ? "null"
              : input === undefined
              ? "undefined"
              : (typeof input as z.ZodIssueCode),
            path: [],
            message: "Expected number",
          } as z.ZodIssue,
        ],
      };
    }

    const def = schema._def;
    if (!isZodNumberDef(def)) {
      return { success: true, data: input };
    }

    const issues: z.ZodIssue[] = [];

    for (const check of def.checks) {
      if (check.kind === "min") {
        const value = check.value;
        const inclusive = check.inclusive;
        if (value === undefined || inclusive === undefined) continue;

        if (inclusive ? input < value : input <= value) {
          issues.push({
            code: z.ZodIssueCode.too_small,
            type: "number",
            minimum: value,
            inclusive: inclusive,
            path: [],
            message:
              check.message ??
              `Number must be greater than ${inclusive ? "or equal to " : ""}${value}`,
          } as z.ZodIssue);
        }
      } else if (check.kind === "max") {
        const value = check.value;
        const inclusive = check.inclusive;
        if (value === undefined || inclusive === undefined) continue;

        if (inclusive ? input > value : input >= value) {
          issues.push({
            code: z.ZodIssueCode.too_big,
            type: "number",
            maximum: value,
            inclusive: inclusive,
            path: [],
            message:
              check.message ??
              `Number must be less than ${inclusive ? "or equal to " : ""}${value}`,
          } as z.ZodIssue);
        }
      }
    }

    if (issues.length > 0) {
      return { success: false, issues };
    }

    return { success: true, data: input };
  } catch (error) {
    throw new ServiceError("zodNumberParse failed", { cause: error });
  }
}

export { ServiceError };