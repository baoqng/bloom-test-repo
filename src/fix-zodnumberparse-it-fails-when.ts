// bloom-deps: zod@^3

import { z } from "zod";

function parseZodNumber(
  def: z.ZodNumberDef,
  input: { data: unknown }
): { success: true; data: number } | { success: false; error: z.ZodError } {
  const issues: z.ZodIssue[] = [];

  if (typeof input.data !== "number" || isNaN(input.data)) {
    issues.push({
      code: z.ZodIssueCode.invalid_type,
      expected: "number",
      received: input.data === null ? "null" : (typeof input.data as z.ZodIssueCode),
      path: [],
      message: "Expected number, received " + (input.data === null ? "null" : typeof input.data),
    } as z.ZodIssue);

    return { success: false, error: new z.ZodError(issues) };
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
          path: [],
          message: check.message ?? (check.inclusive
            ? `Number must be greater than or equal to ${check.value}`
            : `Number must be greater than ${check.value}`),
        } as z.ZodIssue);
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive ? value > check.value : value >= check.value;
      if (tooBig) {
        issues.push({
          code: z.ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          path: [],
          message: check.message ?? (check.inclusive
            ? `Number must be less than or equal to ${check.value}`
            : `Number must be less than ${check.value}`),
        } as z.ZodIssue);
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(value)) {
        issues.push({
          code: z.ZodIssueCode.invalid_type,
          expected: "integer",
          received: "float",
          path: [],
          message: check.message ?? "Expected integer, received float",
        } as unknown as z.ZodIssue);
      }
    } else if (check.kind === "multipleOf") {
      if (value % check.value !== 0) {
        issues.push({
          code: z.ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          path: [],
          message: check.message ?? `Number must be a multiple of ${check.value}`,
        } as z.ZodIssue);
      }
    } else if (check.kind === "finite") {
      if (!isFinite(value)) {
        issues.push({
          code: z.ZodIssueCode.not_finite,
          path: [],
          message: check.message ?? "Number must be finite",
        } as z.ZodIssue);
      }
    }
  }

  if (issues.length > 0) {
    return { success: false, error: new z.ZodError(issues) };
  }

  return { success: true, data: value };
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function createValidatedNumberSchema(options?: {
  min?: { value: number; inclusive: boolean };
  max?: { value: number; inclusive: boolean };
  int?: boolean;
  multipleOf?: number;
  finite?: boolean;
}): z.ZodNumber {
  let schema = z.number();

  if (options?.int) {
    schema = schema.int();
  }

  if (options?.min !== undefined) {
    const { value, inclusive } = options.min;
    if (inclusive) {
      schema = schema.min(value);
    } else {
      schema = schema.gt(value);
    }
  }

  if (options?.max !== undefined) {
    const { value, inclusive } = options.max;
    if (inclusive) {
      schema = schema.max(value);
    } else {
      schema = schema.lt(value);
    }
  }

  if (options?.multipleOf !== undefined) {
    schema = schema.multipleOf(options.multipleOf);
  }

  if (options?.finite) {
    schema = schema.finite();
  }

  return schema;
}

export function validateNumber(
  value: unknown,
  def: z.ZodNumberDef
): { success: true; data: number } | { success: false; error: z.ZodError } {
  return parseZodNumber(def, { data: value });
}

export function safeParseNumber(
  schema: z.ZodNumber,
  input: unknown
): { success: true; data: number } | { success: false; error: z.ZodError } {
  if (!isNumber(input)) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: input === null ? "null" : (typeof input as z.ZodIssueCode),
          path: [],
          message: `Expected number, received ${input === null ? "null" : typeof input}`,
        } as z.ZodIssue,
      ]),
    };
  }

  return parseZodNumber(schema._def, { data: input });
}

export { parseZodNumber };