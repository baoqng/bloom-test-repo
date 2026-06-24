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
  addIssue: (issue: {
    code: string;
    type: string;
    minimum?: number;
    maximum?: number;
    inclusive: boolean;
    message: string;
  }) => void;
}

interface ParseReturnType {
  status: "valid" | "dirty" | "aborted";
  value?: number;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value);
}

function zodNumberParse(
  input: ParseInput,
  ctx: ParseContext,
  def: ZodNumberDef
): ParseReturnType {
  if (!isNumber(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      type: "number",
      inclusive: false,
      message: "Expected number, received " + typeof input.data,
    });
    return { status: "aborted" };
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
          message: check.message ?? "value out of range",
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
          message: check.message ?? "value out of range",
        });
        isValid = false;
      }
    }
  }

  if (!isValid) {
    return { status: "dirty", value: data };
  }

  return { status: "valid", value: data };
}

function createNumberSchema(checks: NumberCheck[]): z.ZodNumber {
  let schema = z.number();

  for (const check of checks) {
    if (check.kind === "min") {
      if (check.inclusive) {
        schema = check.message !== undefined
          ? schema.min(check.value, { message: check.message })
          : schema.min(check.value);
      } else {
        schema = check.message !== undefined
          ? schema.gt(check.value, { message: check.message })
          : schema.gt(check.value);
      }
    } else if (check.kind === "max") {
      if (check.inclusive) {
        schema = check.message !== undefined
          ? schema.max(check.value, { message: check.message })
          : schema.max(check.value);
      } else {
        schema = check.message !== undefined
          ? schema.lt(check.value, { message: check.message })
          : schema.lt(check.value);
      }
    }
  }

  return schema;
}

function parseNumber(
  value: unknown,
  checks: NumberCheck[]
): { success: true; data: number } | { success: false; errors: { field: string; message: string; code: string }[] } {
  if (value === null || value === undefined) {
    return { success: false, errors: [{ field: "value", message: "Value cannot be null or undefined", code: "invalid_type" }] };
  }

  const schema = createNumberSchema(checks);

  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join(".") : "value",
    message: issue.message,
    code: issue.code,
  }));

  return { success: false, errors };
}

export { zodNumberParse, parseNumber, createNumberSchema };
export type { MinCheck, MaxCheck, NumberCheck, ZodNumberDef, ParseInput, ParseContext, ParseReturnType };
```