// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

class ZodNumber extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
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
        const failsMin = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (failsMin) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "max") {
        const failsMax = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (failsMax) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      }
    }

    return hadError ? z.INVALID : z.OK(input.data);
  }
}

function createZodNumber(): ZodNumber {
  return new ZodNumber({
    checks: [],
    typeName: z.ZodFirstPartyTypeKind.ZodNumber,
    coerce: false,
  });
}

export { ZodNumber, createZodNumber };
export default createZodNumber;