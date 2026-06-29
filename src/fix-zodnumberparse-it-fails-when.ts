// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type MinCheck = { kind: "min"; value: number; inclusive: boolean; message?: string };
type MaxCheck = { kind: "max"; value: number; inclusive: boolean; message?: string };
type MultipleOfCheck = { kind: "multipleOf"; value: number; message?: string };
type FiniteCheck = { kind: "finite"; message?: string };
type IntCheck = { kind: "int"; message?: string };

type NumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

function isMinCheck(check: NumberCheck): check is MinCheck {
  return check.kind === "min";
}

function isMaxCheck(check: NumberCheck): check is MaxCheck {
  return check.kind === "max";
}

function isMultipleOfCheck(check: NumberCheck): check is MultipleOfCheck {
  return check.kind === "multipleOf";
}

function isFiniteCheck(check: NumberCheck): check is FiniteCheck {
  return check.kind === "finite";
}

function isIntCheck(check: NumberCheck): check is IntCheck {
  return check.kind === "int";
}

function isNumberCheckArray(checks: unknown): checks is NumberCheck[] {
  if (!Array.isArray(checks)) return false;
  return checks.every(
    (c): c is NumberCheck =>
      typeof c === "object" &&
      c !== null &&
      "kind" in c &&
      typeof (c as Record<string, unknown>)["kind"] === "string"
  );
}

export function parseNumber(
  input: unknown,
  def: { checks: unknown }
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  const issues: z.ZodIssue[] = [];

  if (typeof input !== "number" || Number.isNaN(input)) {
    issues.push({
      code: ZodIssueCode.invalid_type,
      expected: "number" as z.ZodParsedType,
      received: (typeof input === "number" ? "nan" : typeof input) as z.ZodParsedType,
      path: [],
      message: "Expected number, received " + (typeof input === "number" ? "nan" : typeof input),
    });
    return { success: false, errors: issues };
  }

  const data: number = input;

  if (!isNumberCheckArray(def.checks)) {
    return { success: true, data };
  }

  for (const check of def.checks) {
    if (isMinCheck(check)) {
      const tooSmall = check.inclusive ? data < check.value : data <= check.value;
      if (tooSmall) {
        issues.push({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          path: [],
          message: check.message ?? `Number must be ${check.inclusive ? "greater than or equal to" : "greater than"} ${check.value}`,
        });
      }
    } else if (isMaxCheck(check)) {
      const tooBig = check.inclusive ? data > check.value : data >= check.value;
      if (tooBig) {
        issues.push({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          path: [],
          message: check.message ?? `Number must be ${check.inclusive ? "less than or equal to" : "less than"} ${check.value}`,
        });
      }
    } else if (isMultipleOfCheck(check)) {
      if (!Number.isFinite(data) || data % check.value !== 0) {
        issues.push({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          path: [],
          message: check.message ?? `Number must be a multiple of ${check.value}`,
        });
      }
    } else if (isFiniteCheck(check)) {
      if (!Number.isFinite(data)) {
        issues.push({
          code: ZodIssueCode.not_finite,
          path: [],
          message: check.message ?? "Number must be finite",
        });
      }
    } else if (isIntCheck(check)) {
      if (!Number.isInteger(data)) {
        issues.push({
          code: ZodIssueCode.invalid_type,
          expected: "integer" as z.ZodParsedType,
          received: "float" as z.ZodParsedType,
          path: [],
          message: check.message ?? "Expected integer, received float",
        });
      }
    }
  }

  if (issues.length > 0) {
    return { success: false, errors: issues };
  }

  return { success: true, data };
}

export function createValidatedNumberSchema(checks: NumberCheck[]): z.ZodNumber {
  let schema = z.number();

  for (const check of checks) {
    if (isMinCheck(check)) {
      schema = check.inclusive ? schema.min(check.value, check.message) : schema.gt(check.value, check.message);
    } else if (isMaxCheck(check)) {
      schema = check.inclusive ? schema.max(check.value, check.message) : schema.lt(check.value, check.message);
    } else if (isMultipleOfCheck(check)) {
      schema = schema.multipleOf(check.value, check.message);
    } else if (isFiniteCheck(check)) {
      schema = schema.finite(check.message);
    } else if (isIntCheck(check)) {
      schema = schema.int(check.message);
    }
  }

  return schema;
}

export function validateNumberWithChecks(
  value: unknown,
  checks: NumberCheck[]
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  const schema = createValidatedNumberSchema(checks);
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error.issues };
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export { NumberCheck, MinCheck, MaxCheck, MultipleOfCheck, FiniteCheck, IntCheck };