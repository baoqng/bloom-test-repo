// bloom-deps: zod@^3

import { z } from "zod";

export function createValidatedNumber() {
  return z.number();
}

export class ZodNumberValidator {
  private schema: z.ZodNumber;

  constructor(schema?: z.ZodNumber) {
    this.schema = schema ?? z.number();
  }

  min(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumberValidator {
    const inclusive = options?.inclusive !== undefined ? options.inclusive : true;
    if (inclusive) {
      return new ZodNumberValidator(this.schema.min(value, options?.message));
    } else {
      return new ZodNumberValidator(this.schema.gt(value, options?.message));
    }
  }

  max(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumberValidator {
    const inclusive = options?.inclusive !== undefined ? options.inclusive : true;
    if (inclusive) {
      return new ZodNumberValidator(this.schema.max(value, options?.message));
    } else {
      return new ZodNumberValidator(this.schema.lt(value, options?.message));
    }
  }

  parse(input: unknown): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
    const result = this.schema.safeParse(input);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, errors: result.error.issues };
  }

  getSchema(): z.ZodNumber {
    return this.schema;
  }
}

export interface NumberCheckResult {
  valid: boolean;
  issues: z.ZodIssue[];
}

export function parseNumberWithChecks(
  input: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  >
): NumberCheckResult {
  if (typeof input !== "number" || isNaN(input)) {
    return {
      valid: false,
      issues: [
        {
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: typeof input === "number" ? "nan" : (typeof input as z.ZodIssueBase["path"] extends unknown ? any : any),
          path: [],
          message: "Expected number, received " + typeof input,
        },
      ],
    };
  }

  const issues: z.ZodIssue[] = [];

  for (const check of checks) {
    if (check.kind === "min") {
      const fails = check.inclusive ? input < check.value : input <= check.value;
      if (fails) {
        issues.push({
          code: z.ZodIssueCode.too_small,
          minimum: check.value,
          type: "number",
          inclusive: check.inclusive,
          exact: false,
          path: [],
          message:
            check.message ??
            (check.inclusive
              ? `Number must be greater than or equal to ${check.value}`
              : `Number must be greater than ${check.value}`),
        });
      }
    } else if (check.kind === "max") {
      const fails = check.inclusive ? input > check.value : input >= check.value;
      if (fails) {
        issues.push({
          code: z.ZodIssueCode.too_big,
          maximum: check.value,
          type: "number",
          inclusive: check.inclusive,
          exact: false,
          path: [],
          message:
            check.message ??
            (check.inclusive
              ? `Number must be less than or equal to ${check.value}`
              : `Number must be less than ${check.value}`),
        });
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(input)) {
        issues.push({
          code: z.ZodIssueCode.invalid_type,
          expected: "integer",
          received: "float",
          path: [],
          message: check.message ?? "Expected integer, received float",
        });
      }
    } else if (check.kind === "multipleOf") {
      if (input % check.value !== 0) {
        issues.push({
          code: z.ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          path: [],
          message: check.message ?? `Number must be a multiple of ${check.value}`,
        });
      }
    } else if (check.kind === "finite") {
      if (!isFinite(input)) {
        issues.push({
          code: z.ZodIssueCode.not_finite,
          path: [],
          message: check.message ?? "Number must be finite",
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateNumberSchema(schema: z.ZodNumber, input: unknown): NumberCheckResult {
  const result = schema.safeParse(input);
  if (result.success) {
    return { valid: true, issues: [] };
  }
  return { valid: false, issues: result.error.issues };
}

export function isValidMinBound(value: number, min: number, inclusive: boolean): boolean {
  return inclusive ? value >= min : value > min;
}

export function isValidMaxBound(value: number, max: number, inclusive: boolean): boolean {
  return inclusive ? value <= max : value < max;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function isValidPrice(price: number, minPrice: number): boolean {
  return price >= minPrice;
}

export function buildNumberSchema(options: {
  min?: { value: number; inclusive?: boolean };
  max?: { value: number; inclusive?: boolean };
  int?: boolean;
  multipleOf?: number;
}): z.ZodNumber {
  let schema = z.number();

  if (options.int) {
    schema = schema.int();
  }

  if (options.min !== undefined) {
    const minOpts = options.min;
    const inclusive = minOpts.inclusive !== undefined ? minOpts.inclusive : true;
    if (inclusive) {
      schema = schema.min(minOpts.value);
    } else {
      schema = schema.gt(minOpts.value);
    }
  }

  if (options.max !== undefined) {
    const maxOpts = options.max;
    const inclusive = maxOpts.inclusive !== undefined ? maxOpts.inclusive : true;
    if (inclusive) {
      schema = schema.max(maxOpts.value);
    } else {
      schema = schema.lt(maxOpts.value);
    }
  }

  if (options.multipleOf !== undefined) {
    schema = schema.multipleOf(options.multipleOf);
  }

  return schema;
}