// bloom-deps: zod@^3

import { z } from "zod";

export class ZodNumber {
  private checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  > = [];

  min(value: number, options?: { inclusive?: boolean; message?: string } | string): this {
    const inclusive = typeof options === "object" ? (options.inclusive ?? true) : true;
    const message = typeof options === "string" ? options : options?.message;
    this.checks.push({ kind: "min", value, inclusive, message });
    return this;
  }

  max(value: number, options?: { inclusive?: boolean; message?: string } | string): this {
    const inclusive = typeof options === "object" ? (options.inclusive ?? true) : true;
    const message = typeof options === "string" ? options : options?.message;
    this.checks.push({ kind: "max", value, inclusive, message });
    return this;
  }

  int(options?: { message?: string } | string): this {
    const message = typeof options === "string" ? options : options?.message;
    this.checks.push({ kind: "int", message });
    return this;
  }

  multipleOf(value: number, options?: { message?: string } | string): this {
    const message = typeof options === "string" ? options : options?.message;
    this.checks.push({ kind: "multipleOf", value, message });
    return this;
  }

  finite(options?: { message?: string } | string): this {
    const message = typeof options === "string" ? options : options?.message;
    this.checks.push({ kind: "finite", message });
    return this;
  }

  _parse(input: unknown): { success: true; data: number } | { success: false; issues: Array<{ code: string; message: string; inclusive?: boolean; minimum?: number; maximum?: number }> } {
    const issues: Array<{ code: string; message: string; inclusive?: boolean; minimum?: number; maximum?: number }> = [];

    if (typeof input !== "number" || isNaN(input)) {
      issues.push({
        code: "invalid_type",
        message: `Expected number, received ${typeof input}`,
      });
      return { success: false, issues };
    }

    const data = input as number;

    const ctx = {
      addIssue: (issue: { code: string; message: string; inclusive?: boolean; minimum?: number; maximum?: number }) => {
        issues.push(issue);
      },
    };

    for (const check of this.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? data < check.value : data <= check.value;
        if (tooSmall) {
          ctx.addIssue({
            code: "too_small",
            message: check.message ?? `Number must be ${check.inclusive ? "greater than or equal to" : "greater than"} ${check.value}`,
            inclusive: check.inclusive,
            minimum: check.value,
          });
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? data > check.value : data >= check.value;
        if (tooBig) {
          ctx.addIssue({
            code: "too_big",
            message: check.message ?? `Number must be ${check.inclusive ? "less than or equal to" : "less than"} ${check.value}`,
            inclusive: check.inclusive,
            maximum: check.value,
          });
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(data)) {
          ctx.addIssue({
            code: "invalid_type",
            message: check.message ?? "Expected integer, received float",
          });
        }
      } else if (check.kind === "multipleOf") {
        if (data % check.value !== 0) {
          ctx.addIssue({
            code: "not_multiple_of",
            message: check.message ?? `Number must be a multiple of ${check.value}`,
          });
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(data)) {
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

    return { success: true, data };
  }
}

export function zodNumber(): ZodNumber {
  return new ZodNumber();
}