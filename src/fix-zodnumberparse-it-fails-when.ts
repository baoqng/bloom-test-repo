// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

class ZodNumber extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const parsedType = this._getType(input);

    if (parsedType !== z.ZodParsedType.number) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    let ctx: z.RefinementCtx | undefined = undefined;

    const status = new z.ParseStatus();

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      }
    }

    return { status: status.value, value: input.data };
  }
}

export function zodNumber(): ZodNumber {
  return new ZodNumber({
    checks: [],
    typeName: z.ZodFirstPartyTypeKind.ZodNumber,
    coerce: false,
  });
}

export { ZodNumber };
export default zodNumber;