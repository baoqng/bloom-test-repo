// bloom-deps: zod

import {
  ZodNumber,
  ZodIssueCode,
  ParseInput,
  ParseReturnType,
  addIssueToContext,
  OK,
  INVALID,
} from "zod";

ZodNumber.prototype._parse = function (
  input: ParseInput
): ParseReturnType<number> {
  const ctx = this._getOrReturnCtx(input);

  if (typeof input.data !== "number" || Number.isNaN(input.data)) {
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: "number" as any,
      received: ctx.parsedType,
    });
    return INVALID;
  }

  let hadError = false;

  for (const check of this._def.checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive
        ? input.data < check.value
        : input.data <= check.value;

      if (tooSmall) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
        hadError = true;
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive
        ? input.data > check.value
        : input.data >= check.value;

      if (tooBig) {
        addIssueToContext(ctx, {
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
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: "integer" as any,
          received: "float" as any,
          message: check.message ?? undefined,
        });
        hadError = true;
      }
    } else if (check.kind === "multipleOf") {
      const remainder = input.data % check.value;
      if (remainder !== 0) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message ?? undefined,
        });
        hadError = true;
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(input.data)) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.not_finite,
          message: check.message ?? undefined,
        });
        hadError = true;
      }
    }
  }

  return hadError ? INVALID : OK(input.data);
};

export { ZodNumber };