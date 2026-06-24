```typescript
import { z, ZodIssueCode } from "zod";

type MinCheck = {
  kind: "min";
  value: number;
  inclusive: boolean;
  message?: string;
};

type MaxCheck = {
  kind: "max";
  value: number;
  inclusive: boolean;
  message?: string;
};

type NumberCheck = MinCheck | MaxCheck | { kind: string };

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

type INVALID = { status: "aborted" };
type OK<T> = { status: "valid"; value: T };

const INVALID: INVALID = { status: "aborted" } as const;

function ok<T>(value: T): OK<T> {
  return { status: "valid", value };
}

function isMinCheck(check: NumberCheck): check is MinCheck {
  return check.kind === "min";
}

function isMaxCheck(check: NumberCheck): check is MaxCheck {
  return check.kind === "max";
}

export function parseZodNumber(
  input: ParseInput,
  def: ZodNumberDef,
  ctx: ParseContext
): OK<number> | INVALID {
  if (input.data === null || input.data === undefined || typeof input.data !== "number" || Number.isNaN(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      type: "number",
      inclusive: false,
      message: "Expected number, received " + typeof input.data,
    });
    return INVALID;
  }

  const value = input.data;
  let hadError = false;

  for (const check of def.checks) {
    if (isMinCheck(check)) {
      const failed = check.inclusive
        ? value < check.value
        : value <= check.value;

      if (failed) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        hadError = true;
      }
    } else if (isMaxCheck(check)) {
      const failed = check.inclusive
        ? value > check.value
        : value >= check.value;

      if (failed) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        hadError = true;
      }
    }
  }

  if (hadError) {
    return INVALID;
  }

  return ok(value);
}

export function createNumberSchema(
  checks: NumberCheck[]
): ReturnType<typeof z.number> {
  let schema = z.number();

  for (const check of checks) {
    if (isMinCheck(check)) {
      if (check.inclusive) {
        schema = schema.min(check.value, { message: check.message });
      } else {
        schema = schema.gt(check.value, { message: check.message });
      }
    } else if (isMaxCheck(check)) {
      if (check.inclusive) {
        schema = schema.max(check.value, { message: check.message });
      } else {
        schema = schema.lt(check.value, { message: check.message });
      }
    }
  }

  return schema;
}

export function validateNumber(
  value: unknown,
  checks: NumberCheck[]
): { success: true; data: number } | { success: false; errors: { field: string; message: string; code: string }[] } {
  if (value === null || value === undefined) {
    return {
      success: false,
      errors: [
        {
          field: "value",
          message: "Expected number, received " + typeof value,
          code: ZodIssueCode.invalid_type,
        },
      ],
    };
  }

  const issues: { code: string; type: string; minimum?: number; maximum?: number; inclusive: boolean; message: string }[] = [];

  const ctx: ParseContext = {
    addIssue: (issue) => {
      issues.push(issue);
    },
  };

  const result = parseZodNumber({ data: value }, { checks }, ctx);

  if (result.status === "aborted") {
    return {
      success: false,
      errors: issues.map((issue) => ({
        field: "value",
        message: issue.message,
        code: issue.code,
      })),
    };
  }

  return { success: true, data: result.value };
}
```