// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

export function fixedZodNumberParse(
  schema: z.ZodNumber,
  input: unknown
): z.SafeParseReturnType<number, number> {
  return schema.safeParse(input);
}

export class ZodNumber {
  private checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  >;

  constructor(
    checks: Array<
      | { kind: "min"; value: number; inclusive: boolean; message?: string }
      | { kind: "max"; value: number; inclusive: boolean; message?: string }
      | { kind: "int"; message?: string }
      | { kind: "multipleOf"; value: number; message?: string }
      | { kind: "finite"; message?: string }
    > = []
  ) {
    this.checks = checks;
  }

  _parse(input: unknown): { success: true; data: number } | { success: false; issues: Array<{ code: string; message: string; path: Array<string | number> }> } {
    const issues: Array<{ code: string; message: string; path: Array<string | number> }> = [];

    if (typeof input !== "number" || isNaN(input)) {
      issues.push({
        code: "invalid_type",
        message: `Expected number, received ${typeof input}`,
        path: [],
      });
      return { success: false, issues };
    }

    const ctx = {
      addIssue: (issue: { code: string; message: string; path?: Array<string | number> }) => {
        issues.push({
          code: issue.code,
          message: issue.message,
          path: issue.path ?? [],
        });
      },
    };

    for (const check of this.checks) {
      if (check.kind === "min") {
        // For kind "min": if inclusive, fail when input < value; if not inclusive, fail when input <= value
        if (check.inclusive ? input < check.value : input <= check.value) {
          ctx.addIssue({
            code: "too_small",
            message:
              check.message ??
              `Number must be greater than${check.inclusive ? " or equal to" : ""} ${check.value}`,
          });
        }
      } else if (check.kind === "max") {
        // For kind "max": if inclusive, fail when input > value; if not inclusive, fail when input >= value
        if (check.inclusive ? input > check.value : input >= check.value) {
          ctx.addIssue({
            code: "too_big",
            message:
              check.message ??
              `Number must be less than${check.inclusive ? " or equal to" : ""} ${check.value}`,
          });
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input)) {
          ctx.addIssue({
            code: "invalid_type",
            message: check.message ?? "Expected integer, received float",
          });
        }
      } else if (check.kind === "multipleOf") {
        if (input % check.value !== 0) {
          ctx.addIssue({
            code: "not_multiple_of",
            message: check.message ?? `Number must be a multiple of ${check.value}`,
          });
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input)) {
          ctx.addIssue({
            code: "not_finite",
            message: check.message ?? "Number must be finite",
          });
        }
      }
    }

    if (issues.length > 0) {
      return { success: false, issues };
    }

    return { success: true, data: input };
  }

  min(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumber {
    return new ZodNumber([
      ...this.checks,
      {
        kind: "min",
        value,
        inclusive: options?.inclusive ?? true,
        message: options?.message,
      },
    ]);
  }

  max(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumber {
    return new ZodNumber([
      ...this.checks,
      {
        kind: "max",
        value,
        inclusive: options?.inclusive ?? true,
        message: options?.message,
      },
    ]);
  }

  int(options?: { message?: string }): ZodNumber {
    return new ZodNumber([
      ...this.checks,
      { kind: "int", message: options?.message },
    ]);
  }

  multipleOf(value: number, options?: { message?: string }): ZodNumber {
    return new ZodNumber([
      ...this.checks,
      { kind: "multipleOf", value, message: options?.message },
    ]);
  }

  finite(options?: { message?: string }): ZodNumber {
    return new ZodNumber([
      ...this.checks,
      { kind: "finite", message: options?.message },
    ]);
  }

  static create(): ZodNumber {
    return new ZodNumber();
  }
}

export function parseNumber(
  value: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  > = []
): { success: true; data: number } | { success: false; issues: Array<{ code: string; message: string; path: Array<string | number> }> } {
  try {
    const parser = new ZodNumber(checks);
    return parser._parse(value);
  } catch (error) {
    throw new ServiceError("parseNumber operation failed", { cause: error });
  }
}

export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function validateBoundedNumber(
  value: unknown,
  min?: number,
  max?: number,
  options?: { minInclusive?: boolean; maxInclusive?: boolean }
): { success: true; data: number } | { success: false; issues: Array<{ code: string; message: string; path: Array<string | number> }> } {
  try {
    const checks: Array<
      | { kind: "min"; value: number; inclusive: boolean }
      | { kind: "max"; value: number; inclusive: boolean }
    > = [];

    if (min !== undefined && min !== null) {
      checks.push({
        kind: "min",
        value: min,
        inclusive: options?.minInclusive ?? true,
      });
    }

    if (max !== undefined && max !== null) {
      checks.push({
        kind: "max",
        value: max,
        inclusive: options?.maxInclusive ?? true,
      });
    }

    return parseNumber(value, checks);
  } catch (error) {
    throw new ServiceError("validateBoundedNumber operation failed", { cause: error });
  }
}