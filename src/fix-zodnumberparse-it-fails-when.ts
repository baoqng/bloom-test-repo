// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;

type ZodNumberCheck =
  | { kind: "min"; value: number; inclusive: boolean; message?: string }
  | { kind: "max"; value: number; inclusive: boolean; message?: string }
  | { kind: "int"; message?: string }
  | { kind: "multipleOf"; value: number; message?: string }
  | { kind: "finite"; message?: string };

interface ZodNumberDef extends z.ZodTypeDef {
  checks: ZodNumberCheck[];
  typeName: z.ZodFirstPartyTypeKind.ZodNumber;
  coerce: boolean;
}

function isZodNumberDef(def: unknown): def is ZodNumberDef {
  if (def === null || typeof def !== "object") return false;
  const d = def as Record<string, unknown>;
  return (
    d["typeName"] === z.ZodFirstPartyTypeKind.ZodNumber &&
    Array.isArray(d["checks"])
  );
}

function isNumberCheck(check: unknown): check is ZodNumberCheck {
  if (check === null || typeof check !== "object") return false;
  const c = check as Record<string, unknown>;
  return typeof c["kind"] === "string";
}

export function parseZodNumber(
  schema: z.ZodNumber,
  data: unknown
): z.SafeParseReturnType<number, number> {
  return schema.safeParse(data);
}

export function createZodNumberWithChecks(
  min?: { value: number; inclusive: boolean; message?: string },
  max?: { value: number; inclusive: boolean; message?: string }
): z.ZodNumber {
  let schema = z.number();
  if (min !== undefined) {
    if (min.inclusive) {
      schema = min.message !== undefined
        ? schema.min(min.value, { message: min.message })
        : schema.min(min.value);
    } else {
      schema = min.message !== undefined
        ? schema.gt(min.value, { message: min.message })
        : schema.gt(min.value);
    }
  }
  if (max !== undefined) {
    if (max.inclusive) {
      schema = max.message !== undefined
        ? schema.max(max.value, { message: max.message })
        : schema.max(max.value);
    } else {
      schema = max.message !== undefined
        ? schema.lt(max.value, { message: max.message })
        : schema.lt(max.value);
    }
  }
  return schema;
}

export function validateNumber(
  data: unknown,
  checks: ZodNumberCheck[]
): z.ZodIssue[] {
  const issues: z.ZodIssue[] = [];

  if (typeof data !== "number" || isNaN(data)) {
    issues.push({
      code: ZodIssueCode.invalid_type,
      expected: "number",
      received: data === null ? "null" : typeof data as z.ZodParsedType,
      path: [],
      message: "Expected number, received " + (data === null ? "null" : typeof data),
    });
    return issues;
  }

  for (const check of checks) {
    if (!isNumberCheck(check)) continue;

    if (check.kind === "min") {
      const failed = check.inclusive ? data < check.value : data <= check.value;
      if (failed) {
        issues.push({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          exact: false,
          path: [],
          message: check.message ?? `Number must be greater than ${check.inclusive ? "or equal to " : ""}${check.value}`,
        });
      }
    } else if (check.kind === "max") {
      const failed = check.inclusive ? data > check.value : data >= check.value;
      if (failed) {
        issues.push({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          exact: false,
          path: [],
          message: check.message ?? `Number must be less than ${check.inclusive ? "or equal to " : ""}${check.value}`,
        });
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(data)) {
        issues.push({
          code: ZodIssueCode.invalid_type,
          expected: "integer",
          received: "float" as z.ZodParsedType,
          path: [],
          message: check.message ?? "Expected integer, received float",
        });
      }
    } else if (check.kind === "multipleOf") {
      if (data % check.value !== 0) {
        issues.push({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          path: [],
          message: check.message ?? `Number must be a multiple of ${check.value}`,
        });
      }
    } else if (check.kind === "finite") {
      if (!isFinite(data)) {
        issues.push({
          code: ZodIssueCode.not_finite,
          path: [],
          message: check.message ?? "Number must be finite",
        });
      }
    }
  }

  return issues;
}

export function parseNumberWithBoundaryChecks(
  data: unknown,
  options?: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  }
): { success: true; data: number } | { success: false; issues: z.ZodIssue[] } {
  const checks: ZodNumberCheck[] = [];

  if (options?.min !== undefined) {
    const minOpt = options.min;
    checks.push({
      kind: "min",
      value: minOpt.value,
      inclusive: minOpt.inclusive,
      message: minOpt.message,
    });
  }

  if (options?.max !== undefined) {
    const maxOpt = options.max;
    checks.push({
      kind: "max",
      value: maxOpt.value,
      inclusive: maxOpt.inclusive,
      message: maxOpt.message,
    });
  }

  const issues = validateNumber(data, checks);

  if (issues.length > 0) {
    return { success: false, issues };
  }

  if (typeof data !== "number") {
    return {
      success: false,
      issues: [
        {
          code: ZodIssueCode.invalid_type,
          expected: "number",
          received: typeof data as z.ZodParsedType,
          path: [],
          message: "Expected number",
        },
      ],
    };
  }

  return { success: true, data };
}

export function getChecksFromZodNumber(schema: z.ZodNumber): ZodNumberCheck[] {
  const def: unknown = schema._def;
  if (!isZodNumberDef(def)) {
    return [];
  }
  return def.checks.filter(isNumberCheck);
}

export function zodNumberParseWithBoundaryValidation(
  schema: z.ZodNumber,
  data: unknown
): { success: true; data: number } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  return result;
}