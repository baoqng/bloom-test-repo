// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

export class ZodNumberFixed extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const ctx = this._getOrReturnCtx(input);

    if (typeof input.data !== "number" || isNaN(input.data)) {
      z.ZodNumber.prototype._parse.call(this, input);
      return z.INVALID;
    }

    let hasIssues = false;

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const failed = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (failed) {
          ctx.addIssue({
            code: "too_small" as z.ZodIssueCode,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hasIssues = true;
        }
      } else if (check.kind === "max") {
        const failed = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (failed) {
          ctx.addIssue({
            code: "too_big" as z.ZodIssueCode,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hasIssues = true;
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          ctx.addIssue({
            code: "invalid_type" as z.ZodIssueCode,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message ?? undefined,
          });
          hasIssues = true;
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          ctx.addIssue({
            code: "not_multiple_of" as z.ZodIssueCode,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
          hasIssues = true;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx.addIssue({
            code: "not_finite" as z.ZodIssueCode,
            message: check.message ?? undefined,
          });
          hasIssues = true;
        }
      }
    }

    return hasIssues ? z.INVALID : z.OK(input.data);
  }

  static create(params?: z.RawCreateParams): ZodNumberFixed {
    const processedParams = params ? Object.assign({}, params) : {};
    return new ZodNumberFixed({
      checks: [],
      typeName: z.ZodFirstPartyTypeKind.ZodNumber,
      coerce: (processedParams as { coerce?: boolean }).coerce ?? false,
      ...processedParams,
    });
  }
}

export function parseNumber(
  value: unknown,
  schema: z.ZodNumber
): z.SafeParseReturnType<number> {
  return schema.safeParse(value);
}

export function validateMin(
  value: number,
  minValue: number,
  inclusive: boolean
): boolean {
  return inclusive ? value >= minValue : value > minValue;
}

export function validateMax(
  value: number,
  maxValue: number,
  inclusive: boolean
): boolean {
  return inclusive ? value <= maxValue : value < maxValue;
}

export function createFixedNumberSchema(): ZodNumberFixed {
  return ZodNumberFixed.create();
}

export { z };