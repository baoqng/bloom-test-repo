// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type MinCheck = { kind: "min"; value: number; inclusive: boolean; message?: string };
type MaxCheck = { kind: "max"; value: number; inclusive: boolean; message?: string };
type MultipleOfCheck = { kind: "multipleOf"; value: number; message?: string };
type FiniteCheck = { kind: "finite"; message?: string };
type IntCheck = { kind: "int"; message?: string };

type ZodNumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

interface ZodNumberDef {
  checks: ZodNumberCheck[];
  typeName: "ZodNumber";
  coerce: boolean;
}

interface ParseInput {
  data: unknown;
}

interface ParseContext {
  addIssue: (issue: {
    code: ZodIssueCode;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    exact?: boolean;
    message?: string;
    multipleOf?: number;
  }) => void;
}

type ParseReturnType<T> = { status: "valid"; value: T } | { status: "dirty"; value: T } | { status: "aborted" };

function INVALID(): { status: "aborted" } {
  return { status: "aborted" };
}

function OK<T>(value: T): { status: "valid"; value: T } {
  return { status: "valid", value };
}

export function parseZodNumber(
  def: ZodNumberDef,
  input: ParseInput,
  ctx: ParseContext
): ParseReturnType<number> {
  if (typeof input.data !== "number" || isNaN(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      message: `Expected number, received ${typeof input.data}`,
    });
    return INVALID();
  }

  const data = input.data as number;
  let hasError = false;

  for (const check of def.checks) {
    if (check.kind === "min") {
      const minCheck = check as MinCheck;
      const tooSmall = minCheck.inclusive
        ? data < minCheck.value
        : data <= minCheck.value;

      if (tooSmall) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: minCheck.value,
          inclusive: minCheck.inclusive,
          message: minCheck.message ?? undefined,
        });
        hasError = true;
      }
    } else if (check.kind === "max") {
      const maxCheck = check as MaxCheck;
      const tooBig = maxCheck.inclusive
        ? data > maxCheck.value
        : data >= maxCheck.value;

      if (tooBig) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: maxCheck.value,
          inclusive: maxCheck.inclusive,
          message: maxCheck.message ?? undefined,
        });
        hasError = true;
      }
    } else if (check.kind === "int") {
      const intCheck = check as IntCheck;
      if (!Number.isInteger(data)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_type,
          message: intCheck.message ?? "Expected integer, received float",
        });
        hasError = true;
      }
    } else if (check.kind === "multipleOf") {
      const multipleOfCheck = check as MultipleOfCheck;
      if (data % multipleOfCheck.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: multipleOfCheck.value,
          message: multipleOfCheck.message ?? undefined,
        });
        hasError = true;
      }
    } else if (check.kind === "finite") {
      const finiteCheck = check as FiniteCheck;
      if (!isFinite(data)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: finiteCheck.message ?? undefined,
        });
        hasError = true;
      }
    }
  }

  if (hasError) {
    return INVALID();
  }

  return OK(data);
}

export function createZodNumberValidator(checks: ZodNumberCheck[]): {
  parse: (input: unknown) => number;
  safeParse: (input: unknown) => { success: true; data: number } | { success: false; error: z.ZodError };
} {
  let schema = z.number();

  for (const check of checks) {
    if (check.kind === "min") {
      const minCheck = check as MinCheck;
      if (minCheck.inclusive) {
        schema = schema.min(minCheck.value, minCheck.message);
      } else {
        schema = schema.gt(minCheck.value, minCheck.message);
      }
    } else if (check.kind === "max") {
      const maxCheck = check as MaxCheck;
      if (maxCheck.inclusive) {
        schema = schema.max(maxCheck.value, maxCheck.message);
      } else {
        schema = schema.lt(maxCheck.value, maxCheck.message);
      }
    } else if (check.kind === "int") {
      const intCheck = check as IntCheck;
      schema = schema.int(intCheck.message);
    } else if (check.kind === "multipleOf") {
      const multipleOfCheck = check as MultipleOfCheck;
      schema = schema.multipleOf(multipleOfCheck.value, multipleOfCheck.message);
    } else if (check.kind === "finite") {
      const finiteCheck = check as FiniteCheck;
      schema = schema.finite(finiteCheck.message);
    }
  }

  return {
    parse: (input: unknown): number => {
      try {
        return schema.parse(input);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Validation failed: ${error.message}`, { cause: error });
        }
        throw new Error("Unexpected validation error", { cause: error });
      }
    },
    safeParse: (input: unknown): { success: true; data: number } | { success: false; error: z.ZodError } => {
      try {
        const result = schema.safeParse(input);
        return result;
      } catch (error) {
        throw new Error("Unexpected error during safe parse", { cause: error });
      }
    },
  };
}

export function validateNumberRange(
  value: number | null | undefined,
  minValue: number,
  maxValue: number,
  options?: { minInclusive?: boolean; maxInclusive?: boolean }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return { valid: false, errors: ["Value is required"] };
  }

  if (typeof value !== "number" || isNaN(value)) {
    return { valid: false, errors: ["Value must be a number"] };
  }

  const minInclusive = options?.minInclusive ?? true;
  const maxInclusive = options?.maxInclusive ?? true;

  const tooSmall = minInclusive ? value < minValue : value <= minValue;
  const tooBig = maxInclusive ? value > maxValue : value >= maxValue;

  if (tooSmall) {
    const comparison = minInclusive ? ">=" : ">";
    errors.push(`Value must be ${comparison} ${minValue}`);
  }

  if (tooBig) {
    const comparison = maxInclusive ? "<=" : "<";
    errors.push(`Value must be ${comparison} ${maxValue}`);
  }

  return { valid: errors.length === 0, errors };
}

export { ZodNumberCheck, ZodNumberDef, MinCheck, MaxCheck };