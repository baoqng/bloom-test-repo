// bloom-deps: zod@^3

import { z } from "zod";

type ZodNumberCheck = z.ZodNumberDef["checks"][number];

function isMinCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "min" }> {
  return check.kind === "min";
}

function isMaxCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "max" }> {
  return check.kind === "max";
}

function isMultipleOfCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "multipleOf" }> {
  return check.kind === "multipleOf";
}

function isFiniteCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "finite" }> {
  return check.kind === "finite";
}

function isIntCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "int" }> {
  return check.kind === "int";
}

export function parseNumber(
  schema: z.ZodNumber,
  input: unknown
): z.SafeParseReturnType<number, number> {
  return schema.safeParse(input);
}

export class SafeZodNumber {
  private checks: ZodNumberCheck[] = [];
  private _min: { value: number; inclusive: boolean; message?: string } | null = null;
  private _max: { value: number; inclusive: boolean; message?: string } | null = null;

  min(value: number, options?: { inclusive?: boolean; message?: string }): this {
    this._min = {
      value,
      inclusive: options?.inclusive ?? true,
      message: options?.message,
    };
    return this;
  }

  max(value: number, options?: { inclusive?: boolean; message?: string }): this {
    this._max = {
      value,
      inclusive: options?.inclusive ?? true,
      message: options?.message,
    };
    return this;
  }

  parse(input: unknown): { success: true; data: number } | { success: false; issues: string[] } {
    const issues: string[] = [];

    if (typeof input !== "number" || isNaN(input)) {
      issues.push("Expected number, received " + typeof input);
      return { success: false, issues };
    }

    const data = input;

    if (this._min !== null) {
      const minCheck = this._min;
      const tooSmall = minCheck.inclusive ? data < minCheck.value : data <= minCheck.value;
      if (tooSmall) {
        const msg =
          minCheck.message ??
          (minCheck.inclusive
            ? `Number must be greater than or equal to ${minCheck.value}`
            : `Number must be greater than ${minCheck.value}`);
        issues.push(msg);
      }
    }

    if (this._max !== null) {
      const maxCheck = this._max;
      const tooBig = maxCheck.inclusive ? data > maxCheck.value : data >= maxCheck.value;
      if (tooBig) {
        const msg =
          maxCheck.message ??
          (maxCheck.inclusive
            ? `Number must be less than or equal to ${maxCheck.value}`
            : `Number must be less than ${maxCheck.value}`);
        issues.push(msg);
      }
    }

    if (issues.length > 0) {
      return { success: false, issues };
    }

    return { success: true, data };
  }
}

export function validateNumberWithChecks(
  value: unknown,
  checks: ZodNumberCheck[]
): { success: true; data: number } | { success: false; issues: { code: string; message: string }[] } {
  if (typeof value !== "number" || isNaN(value)) {
    return {
      success: false,
      issues: [{ code: z.ZodIssueCode.invalid_type, message: "Expected number" }],
    };
  }

  const data = value;
  const issues: { code: string; message: string }[] = [];

  for (const check of checks) {
    if (isMinCheck(check)) {
      const tooSmall = check.inclusive ? data < check.value : data <= check.value;
      if (tooSmall) {
        issues.push({
          code: z.ZodIssueCode.too_small,
          message:
            check.message ??
            (check.inclusive
              ? `Number must be greater than or equal to ${check.value}`
              : `Number must be greater than ${check.value}`),
        });
      }
    } else if (isMaxCheck(check)) {
      const tooBig = check.inclusive ? data > check.value : data >= check.value;
      if (tooBig) {
        issues.push({
          code: z.ZodIssueCode.too_big,
          message:
            check.message ??
            (check.inclusive
              ? `Number must be less than or equal to ${check.value}`
              : `Number must be less than ${check.value}`),
        });
      }
    } else if (isMultipleOfCheck(check)) {
      if (data % check.value !== 0) {
        issues.push({
          code: z.ZodIssueCode.not_multiple_of,
          message: check.message ?? `Number must be a multiple of ${check.value}`,
        });
      }
    } else if (isFiniteCheck(check)) {
      if (!isFinite(data)) {
        issues.push({
          code: z.ZodIssueCode.not_finite,
          message: check.message ?? "Number must be finite",
        });
      }
    } else if (isIntCheck(check)) {
      if (!Number.isInteger(data)) {
        issues.push({
          code: z.ZodIssueCode.invalid_type,
          message: check.message ?? "Expected integer, received float",
        });
      }
    }
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return { success: true, data };
}

export function buildZodNumberSchema(options: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
  int?: boolean;
  multipleOf?: number;
}): z.ZodNumber {
  let schema = z.number();

  if (options.int) {
    schema = schema.int();
  }

  if (options.min !== null && options.min !== undefined) {
    const minOpt = options.min;
    if (minOpt.inclusive) {
      schema = minOpt.message !== undefined && minOpt.message !== null
        ? schema.min(minOpt.value, { message: minOpt.message })
        : schema.min(minOpt.value);
    } else {
      schema = minOpt.message !== undefined && minOpt.message !== null
        ? schema.gt(minOpt.value, { message: minOpt.message })
        : schema.gt(minOpt.value);
    }
  }

  if (options.max !== null && options.max !== undefined) {
    const maxOpt = options.max;
    if (maxOpt.inclusive) {
      schema = maxOpt.message !== undefined && maxOpt.message !== null
        ? schema.max(maxOpt.value, { message: maxOpt.message })
        : schema.max(maxOpt.value);
    } else {
      schema = maxOpt.message !== undefined && maxOpt.message !== null
        ? schema.lt(maxOpt.value, { message: maxOpt.message })
        : schema.lt(maxOpt.value);
    }
  }

  if (options.multipleOf !== null && options.multipleOf !== undefined) {
    schema = schema.multipleOf(options.multipleOf);
  }

  return schema;
}

export function validateFormNumber(
  formValue: string | null | undefined,
  checks: ZodNumberCheck[]
): { success: true; data: number } | { success: false; issues: { code: string; message: string }[] } {
  if (formValue === null || formValue === undefined || formValue.trim() === "") {
    return {
      success: false,
      issues: [{ code: z.ZodIssueCode.invalid_type, message: "Value is required" }],
    };
  }

  const parsed = Number(formValue);
  if (isNaN(parsed)) {
    return {
      success: false,
      issues: [{ code: z.ZodIssueCode.invalid_type, message: "Expected a valid number" }],
    };
  }

  return validateNumberWithChecks(parsed, checks);
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  if (page < 1 || limit < 1) {
    return [];
  }
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter((num) => num <= maxThreshold);
}