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

function isMinCheck(check: NumberCheck): check is MinCheck {
  return check.kind === "min";
}

function isMaxCheck(check: NumberCheck): check is MaxCheck {
  return check.kind === "max";
}

export function parseZodNumber(
  def: ZodNumberDef,
  input: { data: unknown },
  ctx: { addIssue: (issue: object) => void }
): { success: boolean } {
  if (input.data === null || input.data === undefined) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number",
      received: input.data === null ? "null" : "undefined",
      message: "Expected number, received " + (input.data === null ? "null" : "undefined"),
    });
    return { success: false };
  }

  if (typeof input.data !== "number" || isNaN(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number",
      received: typeof input.data,
      message: "Expected number, received " + typeof input.data,
    });
    return { success: false };
  }

  const value = input.data;
  let hasIssue = false;

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
        hasIssue = true;
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
        hasIssue = true;
      }
    }
  }

  return { success: !hasIssue };
}

export function createBoundedNumberSchema(
  minValue?: number | null,
  maxValue?: number | null,
  options?: {
    minInclusive?: boolean;
    maxInclusive?: boolean;
    minMessage?: string;
    maxMessage?: string;
  }
): z.ZodNumber {
  let schema = z.number();

  if (minValue !== undefined && minValue !== null) {
    const inclusive = options?.minInclusive !== false;
    if (inclusive) {
      schema = schema.min(minValue, options?.minMessage);
    } else {
      schema = schema.gt(minValue, options?.minMessage);
    }
  }

  if (maxValue !== undefined && maxValue !== null) {
    const inclusive = options?.maxInclusive !== false;
    if (inclusive) {
      schema = schema.max(maxValue, options?.maxMessage);
    } else {
      schema = schema.lt(maxValue, options?.maxMessage);
    }
  }

  return schema;
}

export function validateNumberInRange(
  value: unknown,
  minValue?: number | null,
  maxValue?: number | null,
  options?: {
    minInclusive?: boolean;
    maxInclusive?: boolean;
    minMessage?: string;
    maxMessage?: string;
  }
): { valid: boolean; errors: string[] } {
  const checks: NumberCheck[] = [];

  if (minValue !== undefined && minValue !== null) {
    checks.push({
      kind: "min",
      value: minValue,
      inclusive: options?.minInclusive !== false,
      message: options?.minMessage,
    });
  }

  if (maxValue !== undefined && maxValue !== null) {
    checks.push({
      kind: "max",
      value: maxValue,
      inclusive: options?.maxInclusive !== false,
      message: options?.maxMessage,
    });
  }

  const issues: object[] = [];
  const ctx = {
    addIssue: (issue: object) => {
      issues.push(issue);
    },
  };

  const result = parseZodNumber({ checks }, { data: value }, ctx);

  const errors = issues.map((issue) => {
    if (typeof issue === "object" && issue !== null && "message" in issue) {
      const message = (issue as Record<string, unknown>).message;
      if (typeof message === "string") {
        return message;
      }
    }
    return "Validation error";
  });

  return { valid: result.success, errors };
}
```