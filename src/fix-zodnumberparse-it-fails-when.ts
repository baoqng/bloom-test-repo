import { z, ZodIssueCode } from "zod";

const ZodNumberFixed = z.ZodNumber;

const originalParse = ZodNumberFixed.prototype._parse;

ZodNumberFixed.prototype._parse = function (input: z.ParseInput): z.ParseReturnType<number> {
  const ctx = this._getOrReturnCtx(input);

  if (typeof input.data !== "number" || isNaN(input.data)) {
    z.addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: z.ZodParsedType.number,
      received: ctx.parsedType,
    });
    return z.INVALID;
  }

  let hadError = false;

  for (const check of this._def.checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive
        ? input.data < check.value
        : input.data <= check.value;

      if (tooSmall) {
        z.addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        hadError = true;
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive
        ? input.data > check.value
        : input.data >= check.value;

      if (tooBig) {
        z.addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        hadError = true;
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(input.data)) {
        z.addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: "integer" as z.ZodParsedType,
          received: "float" as z.ZodParsedType,
          message: check.message,
        });
        hadError = true;
      }
    } else if (check.kind === "multipleOf") {
      const remainder = input.data % check.value;
      if (Math.abs(remainder) > Number.EPSILON * check.value && Math.abs(remainder) < check.value - Number.EPSILON * check.value ? true : remainder !== 0 && Math.abs(remainder) >= Number.EPSILON) {
        z.addIssueToContext(ctx, {
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message,
        });
        hadError = true;
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(input.data)) {
        z.addIssueToContext(ctx, {
          code: ZodIssueCode.not_finite,
          message: check.message,
        });
        hadError = true;
      }
    }
  }

  if (hadError) {
    return z.INVALID;
  }

  return { status: "valid", value: input.data };
};

export function createNumberSchema(
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
    int?: boolean;
    finite?: boolean;
    multipleOf?: number;
  } = {}
): z.ZodNumber {
  let schema = z.number();

  if (options.int) {
    schema = schema.int();
  }

  if (options.finite) {
    schema = schema.finite();
  }

  if (options.min !== undefined) {
    if (options.min.inclusive) {
      schema = schema.min(options.min.value, options.min.message);
    } else {
      schema = schema.gt(options.min.value, options.min.message);
    }
  }

  if (options.max !== undefined) {
    if (options.max.inclusive) {
      schema = schema.max(options.max.value, options.max.message);
    } else {
      schema = schema.lt(options.max.value, options.max.message);
    }
  }

  if (options.multipleOf !== undefined) {
    schema = schema.multipleOf(options.multipleOf);
  }

  return schema;
}

export function parseNumber(
  value: unknown,
  schema: z.ZodNumber
): { success: true; data: number } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function validateNumberInRange(
  value: unknown,
  min: number,
  max: number,
  inclusive = true
): boolean {
  if (typeof value !== "number" || isNaN(value)) {
    return false;
  }

  const schema = createNumberSchema({
    min: { value: min, inclusive },
    max: { value: max, inclusive },
  });

  const result = schema.safeParse(value);
  return result.success;
}

export { ZodNumberFixed, z, ZodIssueCode };