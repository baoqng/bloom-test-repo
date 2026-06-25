```typescript
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

type NumberCheck = MinCheck | MaxCheck | { kind: string };

function isMinCheck(check: NumberCheck): check is MinCheck {
  return check.kind === "min" && typeof (check as any).value === "number" && typeof (check as any).inclusive === "boolean";
}

function isMaxCheck(check: NumberCheck): check is MaxCheck {
  return check.kind === "max" && typeof (check as any).value === "number" && typeof (check as any).inclusive === "boolean";
}

function parseNumber(
  checks: NumberCheck[],
  input: { data: unknown },
  ctx: z.RefinementCtx
): void {
  if (typeof input.data !== "number") {
    return;
  }

  for (const check of checks) {
    if (isMinCheck(check)) {
      if (check.inclusive ? input.data < check.value : input.data <= check.value) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
      }
    } else if (isMaxCheck(check)) {
      if (check.inclusive ? input.data > check.value : input.data >= check.value) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
      }
    }
  }
}

export function createNumberSchema(checks: NumberCheck[]): z.ZodEffects<z.ZodNumber, number, number> {
  return z.number().superRefine((data, ctx) => {
    parseNumber(checks, { data }, ctx);
  });
}

export function buildNumberValidator(options: {
  min?: { value: number | null; inclusive: boolean; message?: string } | null;
  max?: { value: number | null; inclusive: boolean; message?: string } | null;
}): z.ZodEffects<z.ZodNumber, number, number> {
  const checks: NumberCheck[] = [];

  if (options.min !== null && options.min !== undefined) {
    const min = options.min;
    if (typeof min.value === "number") {
      checks.push({
        kind: "min",
        value: min.value,
        inclusive: min.inclusive,
        message: min.message,
      });
    }
  }

  if (options.max !== null && options.max !== undefined) {
    const max = options.max;
    if (typeof max.value === "number") {
      checks.push({
        kind: "max",
        value: max.value,
        inclusive: max.inclusive,
        message: max.message,
      });
    }
  }

  return createNumberSchema(checks);
}

export function validateNumericRange(
  value: number,
  checks: NumberCheck[]
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const input = { data: value };
  const fakeCtx: z.RefinementCtx = {
    addIssue: (issue: z.IssueData) => {
      const message =
        "message" in issue && typeof issue.message === "string"
          ? issue.message
          : "value out of range";
      issues.push(message);
    },
    path: [],
  };

  parseNumber(checks, input, fakeCtx);

  return {
    valid: issues.length === 0,
    issues,
  };
}

export { parseNumber, MinCheck, MaxCheck, NumberCheck };
```