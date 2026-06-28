// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type NumberCheck = 
  | { kind: "min"; value: number; inclusive: boolean; message?: string }
  | { kind: "max"; value: number; inclusive: boolean; message?: string }
  | { kind: "int"; message?: string }
  | { kind: "multipleOf"; value: number; message?: string }
  | { kind: "finite"; message?: string };

interface ZodNumberDef {
  checks: NumberCheck[];
  typeName: string;
  coerce?: boolean;
}

interface ParseInput {
  data: unknown;
  path: (string | number)[];
  parent: ParseContext;
}

interface ParseContext {
  addIssue: (issue: z.ZodIssueOptionalMessage) => void;
}

const INVALID = Symbol("invalid");
const OK = Symbol("ok");

function isNumber(val: unknown): val is number {
  return typeof val === "number";
}

function parseZodNumber(input: ParseInput, def: ZodNumberDef): { status: typeof OK; value: number } | { status: typeof INVALID } {
  const ctx = input.parent;

  if (!isNumber(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number" as z.ZodParsedType,
      received: typeof input.data as z.ZodParsedType,
    });
    return { status: INVALID };
  }

  const data = input.data;
  let isValid = true;

  for (const check of def.checks) {
    if (check.kind === "min") {
      if (check.inclusive ? data < check.value : data <= check.value) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
        isValid = false;
      }
    } else if (check.kind === "max") {
      if (check.inclusive ? data > check.value : data >= check.value) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
        isValid = false;
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(data)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_type,
          expected: "integer" as z.ZodParsedType,
          received: "float" as z.ZodParsedType,
          message: check.message ?? undefined,
        });
        isValid = false;
      }
    } else if (check.kind === "multipleOf") {
      if (data % check.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message ?? undefined,
        });
        isValid = false;
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(data)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: check.message ?? undefined,
        });
        isValid = false;
      }
    }
  }

  if (!isValid) {
    return { status: INVALID };
  }

  return { status: OK, value: data };
}

export function validateNumber(schema: z.ZodNumber, value: unknown): z.SafeParseReturnType<number, number> {
  return schema.safeParse(value);
}

export function createNumberSchema(options?: {
  min?: { value: number; inclusive?: boolean; message?: string };
  max?: { value: number; inclusive?: boolean; message?: string };
  int?: boolean;
  multipleOf?: number;
  finite?: boolean;
}): z.ZodNumber {
  let schema = z.number();

  if (options?.min !== undefined) {
    const { value, inclusive = true, message } = options.min;
    if (inclusive) {
      schema = message ? schema.min(value, message) : schema.min(value);
    } else {
      schema = message ? schema.gt(value, message) : schema.gt(value);
    }
  }

  if (options?.max !== undefined) {
    const { value, inclusive = true, message } = options.max;
    if (inclusive) {
      schema = message ? schema.max(value, message) : schema.max(value);
    } else {
      schema = message ? schema.lt(value, message) : schema.lt(value);
    }
  }

  if (options?.int) {
    schema = schema.int();
  }

  if (options?.multipleOf !== undefined) {
    schema = schema.multipleOf(options.multipleOf);
  }

  if (options?.finite) {
    schema = schema.finite();
  }

  return schema;
}

export function parseNumber(
  value: unknown,
  options?: {
    min?: { value: number; inclusive?: boolean; message?: string };
    max?: { value: number; inclusive?: boolean; message?: string };
    int?: boolean;
    multipleOf?: number;
    finite?: boolean;
  }
): { success: true; data: number } | { success: false; error: z.ZodError } {
  const schema = createNumberSchema(options);
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}

export function validateNumberRange(
  value: unknown,
  min: number,
  max: number
): { success: true; data: number } | { success: false; error: z.ZodError } {
  const schema = z.number().min(min).max(max);
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}

export function isValidNumberInRange(
  value: unknown,
  min: number,
  max: number
): value is number {
  if (!isNumber(value)) {
    return false;
  }
  return value >= min && value <= max;
}

export { parseZodNumber, isNumber };
export type { NumberCheck, ZodNumberDef, ParseInput, ParseContext };