// bloom-deps: zod@^3

import { z } from "zod";

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

export class ZodNumber {
  _def: {
    checks: Array<
      | { kind: "min"; value: number; inclusive: boolean; message?: string }
      | { kind: "max"; value: number; inclusive: boolean; message?: string }
      | { kind: "int"; message?: string }
      | { kind: "multipleOf"; value: number; message?: string }
      | { kind: "finite"; message?: string }
    >;
  };

  constructor(
    def: {
      checks: Array<
        | { kind: "min"; value: number; inclusive: boolean; message?: string }
        | { kind: "max"; value: number; inclusive: boolean; message?: string }
        | { kind: "int"; message?: string }
        | { kind: "multipleOf"; value: number; message?: string }
        | { kind: "finite"; message?: string }
      >;
    } = { checks: [] }
  ) {
    this._def = def;
  }

  _parse(input: { data: unknown }): { success: boolean; issues: Array<{ code: string; message: string; path: string[] }> } {
    const ctx: { issues: Array<{ code: string; message: string; path: string[] }> } = { issues: [] };

    const addIssue = (issue: { code: string; message: string; path?: string[] }) => {
      ctx.issues.push({ path: [], ...issue });
    };

    if (typeof input.data !== "number" || isNaN(input.data)) {
      addIssue({ code: "invalid_type", message: "Expected number, received " + typeof input.data });
      return { success: false, issues: ctx.issues };
    }

    const value = input.data as number;

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const failsMin = check.inclusive ? value < check.value : value <= check.value;
        if (failsMin) {
          addIssue({
            code: "too_small",
            message: check.message ?? (check.inclusive
              ? `Number must be greater than or equal to ${check.value}`
              : `Number must be greater than ${check.value}`),
          });
        }
      } else if (check.kind === "max") {
        const failsMax = check.inclusive ? value > check.value : value >= check.value;
        if (failsMax) {
          addIssue({
            code: "too_big",
            message: check.message ?? (check.inclusive
              ? `Number must be less than or equal to ${check.value}`
              : `Number must be less than ${check.value}`),
          });
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(value)) {
          addIssue({
            code: "invalid_type",
            message: check.message ?? "Expected integer, received float",
          });
        }
      } else if (check.kind === "multipleOf") {
        if (value % check.value !== 0) {
          addIssue({
            code: "not_multiple_of",
            message: check.message ?? `Number must be a multiple of ${check.value}`,
          });
        }
      } else if (check.kind === "finite") {
        if (!isFinite(value)) {
          addIssue({
            code: "not_finite",
            message: check.message ?? "Number must be finite",
          });
        }
      }
    }

    return { success: ctx.issues.length === 0, issues: ctx.issues };
  }

  min(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumber {
    return new ZodNumber({
      checks: [
        ...this._def.checks,
        {
          kind: "min",
          value,
          inclusive: options?.inclusive ?? true,
          message: options?.message,
        },
      ],
    });
  }

  max(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumber {
    return new ZodNumber({
      checks: [
        ...this._def.checks,
        {
          kind: "max",
          value,
          inclusive: options?.inclusive ?? true,
          message: options?.message,
        },
      ],
    });
  }

  int(options?: { message?: string }): ZodNumber {
    return new ZodNumber({
      checks: [
        ...this._def.checks,
        { kind: "int", message: options?.message },
      ],
    });
  }

  multipleOf(value: number, options?: { message?: string }): ZodNumber {
    return new ZodNumber({
      checks: [
        ...this._def.checks,
        { kind: "multipleOf", value, message: options?.message },
      ],
    });
  }

  finite(options?: { message?: string }): ZodNumber {
    return new ZodNumber({
      checks: [
        ...this._def.checks,
        { kind: "finite", message: options?.message },
      ],
    });
  }

  static create(): ZodNumber {
    return new ZodNumber({ checks: [] });
  }
}

export function createZodNumber(): ZodNumber {
  return ZodNumber.create();
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function validateStringInput(value: unknown, maxLength: number = 255): string {
  if (!isString(value)) {
    throw new ServiceError("operation failed", { cause: new Error("Expected string input") });
  }
  if (value.length > maxLength) {
    throw new ServiceError("operation failed", {
      cause: new Error(`String exceeds maximum length of ${maxLength}`),
    });
  }
  return value;
}

export function validateNumberInput(value: unknown, min?: number, max?: number): number {
  if (!isNumber(value)) {
    throw new ServiceError("operation failed", { cause: new Error("Expected number input") });
  }
  if (min !== undefined && value < min) {
    throw new ServiceError("operation failed", {
      cause: new Error(`Number must be >= ${min}`),
    });
  }
  if (max !== undefined && value > max) {
    throw new ServiceError("operation failed", {
      cause: new Error(`Number must be <= ${max}`),
    });
  }
  return value;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function isWithinBounds(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function isValidPrice(price: number, minPrice: number, maxPrice?: number): boolean {
  if (price < minPrice) return false;
  if (maxPrice !== undefined && price > maxPrice) return false;
  return true;
}