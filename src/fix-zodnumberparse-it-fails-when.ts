```
import { z, ZodIssueCode } from "zod";

interface MinCheck {
  kind: "min";
  value: number;
  inclusive: boolean;
  message?: string;
}

interface MaxCheck {
  kind: "max";
  value: number;
  inclusive: boolean;
  message?: string;
}

type NumberCheck = MinCheck | MaxCheck;

interface ZodNumberDef {
  checks: NumberCheck[];
}

interface ParseInput {
  data: unknown;
}

interface ParseContext {
  addIssue: (issue: object) => void;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function parseNumber(
  def: ZodNumberDef,
  input: ParseInput,
  ctx: ParseContext
): { success: true; data: number } | { success: false } {
  if (input.data === null || input.data === undefined) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number",
      received: typeof input.data,
      message: "Expected number",
    });
    return { success: false };
  }

  if (!isNumber(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number",
      received: typeof input.data,
      message: "Expected number",
    });
    return { success: false };
  }

  const value = input.data;
  let hasIssue = false;

  for (const check of def.checks) {
    if (check.kind === "min") {
      const failed = check.inclusive ? value < check.value : value <= check.value;
      if (failed) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        hasIssue = true;
      }
    } else if (check.kind === "max") {
      const failed = check.inclusive ? value > check.value : value >= check.value;
      if (failed) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        hasIssue = true;
      }
    }
  }

  if (hasIssue) {
    return { success: false };
  }

  return { success: true, data: value };
}

function createNumberSchema(checks: NumberCheck[] = []): z.ZodNumber {
  let schema = z.number();

  for (const check of checks) {
    if (check.kind === "min") {
      if (check.inclusive) {
        schema = check.message
          ? schema.min(check.value, { message: check.message })
          : schema.min(check.value);
      } else {
        schema = check.message
          ? schema.gt(check.value, { message: check.message })
          : schema.gt(check.value);
      }
    } else if (check.kind === "max") {
      if (check.inclusive) {
        schema = check.message
          ? schema.max(check.value, { message: check.message })
          : schema.max(check.value);
      } else {
        schema = check.message
          ? schema.lt(check.value, { message: check.message })
          : schema.lt(check.value);
      }
    }
  }

  return schema;
}

function validateNumber(
  value: unknown,
  checks: NumberCheck[]
): { success: true; data: number } | { success: false; errors: string[] } {
  if (value === null || value === undefined) {
    return { success: false, errors: ["Expected number"] };
  }

  if (!isNumber(value)) {
    return { success: false, errors: ["Expected number"] };
  }

  const schema = createNumberSchema(checks);
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => issue.message);
  return { success: false, errors };
}

function validateNumberWithContext(
  input: ParseInput,
  def: ZodNumberDef,
  ctx: ParseContext
): { success: true; data: number } | { success: false } {
  return parseNumber(def, input, ctx);
}

export {
  parseNumber,
  createNumberSchema,
  validateNumber,
  validateNumberWithContext,
  NumberCheck,
  MinCheck,
  MaxCheck,
  ZodNumberDef,
  ParseInput,
  ParseContext,
};
```