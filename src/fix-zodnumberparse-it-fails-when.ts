import { z, ZodIssueCode } from "zod";

class ZodNumberFixed extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const ctx = this._getOrReturnCtx(input);

    if (typeof input.data !== "number" || isNaN(input.data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    let isValid = true;

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const failed = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (failed) {
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
        const failed = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (failed) {
          ctx.addIssue({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? "value out of range",
          });
          isValid = false;
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message,
          });
          isValid = false;
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          ctx.addIssue({
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          isValid = false;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: check.message,
          });
          isValid = false;
        }
      }
    }

    return isValid ? z.OK(input.data) : z.INVALID;
  }

  static create(params?: z.RawCreateParams): ZodNumberFixed {
    return new ZodNumberFixed({
      checks: [],
      typeName: z.ZodFirstPartyTypeKind.ZodNumber,
      coerce: (params as { coerce?: boolean })?.coerce ?? false,
      ...z.processCreateParams(params),
    });
  }
}

export function createValidatedNumber(params?: z.RawCreateParams): ZodNumberFixed {
  return ZodNumberFixed.create(params);
}

export function parseNumberWithRange(
  value: unknown,
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  } = {}
): number {
  let schema = createValidatedNumber();

  if (options.min !== undefined) {
    if (options.min.inclusive) {
      schema = schema.min(options.min.value, options.min.message) as unknown as ZodNumberFixed;
    } else {
      schema = schema.gt(options.min.value, options.min.message) as unknown as ZodNumberFixed;
    }
  }

  if (options.max !== undefined) {
    if (options.max.inclusive) {
      schema = schema.max(options.max.value, options.max.message) as unknown as ZodNumberFixed;
    } else {
      schema = schema.lt(options.max.value, options.max.message) as unknown as ZodNumberFixed;
    }
  }

  const result = schema.safeParse(value);

  if (!result.success) {
    const errorMessages = result.error.errors
      .map((e: { message: string }) => e.message)
      .join(", ");
    throw new Error(`Validation failed: ${errorMessages}`);
  }

  return result.data;
}

export { ZodNumberFixed };