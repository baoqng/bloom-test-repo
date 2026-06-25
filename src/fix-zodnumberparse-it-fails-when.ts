```
import { z, ZodIssueCode } from "zod";

const originalParse = (z.ZodNumber.prototype as any)._parse;

(z.ZodNumber.prototype as any)._parse = function (input: any) {
  const ctx = this._getOrReturnCtx(input);

  if (input.data === null || input.data === undefined || typeof input.data !== "number" || isNaN(input.data)) {
    this._addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: "number" as any,
      received: ctx.parsedType,
    });
    return { status: "aborted" as const, value: undefined };
  }

  let status: "valid" | "dirty" = "valid";

  for (const check of this._def.checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive
        ? input.data < check.value
        : input.data <= check.value;

      if (tooSmall) {
        this._addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        status = "dirty";
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive
        ? input.data > check.value
        : input.data >= check.value;

      if (tooBig) {
        this._addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        status = "dirty";
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(input.data)) {
        this._addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: "integer" as any,
          received: "float" as any,
          message: check.message,
        });
        status = "dirty";
      }
    } else if (check.kind === "multipleOf") {
      if (input.data % check.value !== 0) {
        this._addIssueToContext(ctx, {
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message,
        });
        status = "dirty";
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(input.data)) {
        this._addIssueToContext(ctx, {
          code: ZodIssueCode.not_finite,
          message: check.message,
        });
        status = "dirty";
      }
    }
  }

  if (status === "dirty") {
    return { status: "dirty" as const, value: input.data };
  }

  return { status: "valid" as const, value: input.data };
};

export { z };

export function createNumberSchema(
  options: {
    min?: { value: number | null; inclusive?: boolean; message?: string };
    max?: { value: number | null; inclusive?: boolean; message?: string };
    int?: boolean;
    multipleOf?: number | null;
    finite?: boolean;
  } = {}
): z.ZodNumber {
  let schema = z.number();

  if (options.min !== undefined && options.min !== null) {
    const minValue = options.min.value;
    if (typeof minValue === "number") {
      const { inclusive = true, message } = options.min;
      if (inclusive) {
        schema = message ? schema.min(minValue, { message }) : schema.min(minValue);
      } else {
        schema = message ? schema.gt(minValue, { message }) : schema.gt(minValue);
      }
    }
  }

  if (options.max !== undefined && options.max !== null) {
    const maxValue = options.max.value;
    if (typeof maxValue === "number") {
      const { inclusive = true, message } = options.max;
      if (inclusive) {
        schema = message ? schema.max(maxValue, { message }) : schema.max(maxValue);
      } else {
        schema = message ? schema.lt(maxValue, { message }) : schema.lt(maxValue);
      }
    }
  }

  if (options.int) {
    schema = schema.int();
  }

  if (options.multipleOf !== undefined && options.multipleOf !== null && typeof options.multipleOf === "number") {
    schema = schema.multipleOf(options.multipleOf);
  }

  if (options.finite) {
    schema = schema.finite();
  }

  return schema;
}

export function validateNumber(
  value: unknown,
  schema: z.ZodNumber
): { success: true; data: number } | { success: false; errors: string[] } {
  if (value === null || value === undefined) {
    return { success: false, errors: ["Value cannot be null or undefined"] };
  }

  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map(
    (issue) => issue.message ?? "Validation failed"
  );
  return { success: false, errors };
}
```