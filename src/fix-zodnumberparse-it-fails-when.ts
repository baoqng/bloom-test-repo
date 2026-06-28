// bloom-deps: zod@^3

import { z } from "zod";

type ZodNumberCheck = z.ZodNumberDef["checks"][number];

function isMinCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "min" }> {
  return check.kind === "min";
}

function isMaxCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "max" }> {
  return check.kind === "max";
}

function isIntCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "int" }> {
  return check.kind === "int";
}

function isMultipleOfCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "multipleOf" }> {
  return check.kind === "multipleOf";
}

function isFiniteCheck(check: ZodNumberCheck): check is Extract<ZodNumberCheck, { kind: "finite" }> {
  return check.kind === "finite";
}

export class PatchedZodNumber extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const parsedType = this._getType(input);

    if (parsedType !== z.ZodParsedType.number) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: z.ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    let ctx: z.ParseContext | undefined = undefined;
    const status = new z.ParseStatus();

    for (const check of this._def.checks) {
      if (isMinCheck(check)) {
        if (check.inclusive ? input.data < check.value : input.data <= check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (isMaxCheck(check)) {
        if (check.inclusive ? input.data > check.value : input.data >= check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (isIntCheck(check)) {
        if (!Number.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (isMultipleOfCheck(check)) {
        if (!isMultipleOf(input.data, check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (isFiniteCheck(check)) {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.not_finite,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      }
    }

    return { status: status.value, value: input.data };
  }

  static create(params?: z.RawCreateParams): PatchedZodNumber {
    const base = z.number(params);
    const patched = new PatchedZodNumber({
      ...base._def,
      checks: base._def.checks ?? [],
    });
    return patched;
  }
}

function isMultipleOf(value: number, step: number): boolean {
  if (step === 0) return false;
  const decimalCount = (n: number): number => {
    const str = String(n);
    const dotIndex = str.indexOf(".");
    return dotIndex === -1 ? 0 : str.length - dotIndex - 1;
  };
  const decimals = Math.max(decimalCount(value), decimalCount(step));
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) % Math.round(step * factor) === 0;
}

export function patchedNumber(params?: z.RawCreateParams): PatchedZodNumber {
  return PatchedZodNumber.create(params);
}

export function parseNumberWithRangeValidation(
  value: unknown,
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  } = {}
): { success: true; data: number } | { success: false; error: z.ZodError } {
  let schema = patchedNumber();

  if (options.min !== undefined) {
    const min = options.min;
    if (min.inclusive) {
      schema = schema.min(min.value, min.message) as PatchedZodNumber;
    } else {
      schema = schema.gt(min.value, min.message) as PatchedZodNumber;
    }
  }

  if (options.max !== undefined) {
    const max = options.max;
    if (max.inclusive) {
      schema = schema.max(max.value, max.message) as PatchedZodNumber;
    } else {
      schema = schema.lt(max.value, max.message) as PatchedZodNumber;
    }
  }

  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}