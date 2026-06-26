// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type ZodNumberCheck =
  | { kind: "min"; value: number; inclusive: boolean; message?: string }
  | { kind: "max"; value: number; inclusive: boolean; message?: string }
  | { kind: "int"; message?: string }
  | { kind: "multipleOf"; value: number; message?: string }
  | { kind: "finite"; message?: string };

interface ZodNumberDef {
  checks: ZodNumberCheck[];
  typeName: string;
  coerce: boolean;
}

export function parseZodNumber(
  def: ZodNumberDef,
  input: { data: unknown },
  ctx: {
    addIssue: (issue: {
      code: string;
      type?: string;
      minimum?: number;
      maximum?: number;
      inclusive?: boolean;
      message?: string;
      [key: string]: unknown;
    }) => void;
  }
): { status: "valid"; value: number } | { status: "invalid" } {
  if (typeof input.data !== "number" || Number.isNaN(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number",
      received: input.data === null ? "null" : typeof input.data,
    });
    return { status: "invalid" };
  }

  const value = input.data;

  for (const check of def.checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive ? value < check.value : value <= check.value;
      if (tooSmall) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
        return { status: "invalid" };
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive ? value > check.value : value >= check.value;
      if (tooBig) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
        return { status: "invalid" };
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(value)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_type,
          message: check.message ?? "Expected integer, received float",
        });
        return { status: "invalid" };
      }
    } else if (check.kind === "multipleOf") {
      if (value % check.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message ?? undefined,
        });
        return { status: "invalid" };
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(value)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: check.message ?? undefined,
        });
        return { status: "invalid" };
      }
    }
  }

  return { status: "valid", value };
}

export function buildZodNumberSchema(
  checks: ZodNumberCheck[]
): z.ZodNumber {
  let schema = z.number();

  for (const check of checks) {
    if (check.kind === "min") {
      schema = check.inclusive
        ? schema.min(check.value, { message: check.message })
        : schema.gt(check.value, { message: check.message });
    } else if (check.kind === "max") {
      schema = check.inclusive
        ? schema.max(check.value, { message: check.message })
        : schema.lt(check.value, { message: check.message });
    } else if (check.kind === "int") {
      schema = schema.int(check.message);
    } else if (check.kind === "multipleOf") {
      schema = schema.multipleOf(check.value, { message: check.message });
    } else if (check.kind === "finite") {
      schema = schema.finite(check.message);
    }
  }

  return schema;
}

export function validateNumber(
  value: unknown,
  checks: ZodNumberCheck[]
): { success: true; data: number } | { success: false; errors: string[] } {
  const schema = buildZodNumberSchema(checks);
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => issue.message);
  return { success: false, errors };
}

export function isWithinRange(
  value: number,
  min: number,
  max: number,
  inclusive = true
): boolean {
  if (inclusive) {
    return value >= min && value <= max;
  }
  return value > min && value < max;
}

export function validatePrice(price: number | null | undefined, minPrice: number, maxPrice: number): boolean {
  if (price === null || price === undefined) {
    return false;
  }
  return price >= minPrice && price <= maxPrice;
}

export function validateQuantity(quantity: number | null | undefined, minQuantity: number, maxQuantity: number): boolean {
  if (quantity === null || quantity === undefined) {
    return false;
  }
  return quantity >= minQuantity && quantity <= maxQuantity;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((score) => score >= minimumThreshold);
}

export function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter((num) => num <= maxThreshold);
}

export function filterByScoreRange(scores: number[], minScore: number, maxScore: number): number[] {
  return scores.filter((score) => score >= minScore && score <= maxScore);
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  if (page < 1 || limit < 1) {
    throw new Error("Page and limit must be positive integers");
  }
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}