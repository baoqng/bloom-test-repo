// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;

export class ZodNumber extends z.ZodNumber {
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

    if (Number.isNaN(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: z.ZodParsedType.nan,
      });
      return z.INVALID;
    }

    let ctx: z.RefinementCtx | undefined = undefined;
    const status = new z.ParseStatus();

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (check.inclusive ? input.data < check.value : input.data <= check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message ?? undefined,
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (check.inclusive ? input.data > check.value : input.data >= check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
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

export function parseNumberWithChecks(
  value: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
  >
): { success: boolean; errors: string[] } {
  if (value === null || value === undefined) {
    return { success: false, errors: ["Value cannot be null or undefined"] };
  }

  let schema = z.number();

  for (const check of checks) {
    if (check.kind === "min") {
      if (check.inclusive) {
        schema = check.message ? schema.min(check.value, { message: check.message }) : schema.min(check.value);
      } else {
        schema = check.message ? schema.gt(check.value, { message: check.message }) : schema.gt(check.value);
      }
    } else if (check.kind === "max") {
      if (check.inclusive) {
        schema = check.message ? schema.max(check.value, { message: check.message }) : schema.max(check.value);
      } else {
        schema = check.message ? schema.lt(check.value, { message: check.message }) : schema.lt(check.value);
      }
    }
  }

  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, errors: [] };
  }

  const errors = result.error && result.error.issues ? result.error.issues.map((issue) => issue.message) : [];
  return { success: false, errors };
}

export function validateNumericRange(
  value: unknown,
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  }
): { success: boolean; errors: string[] } {
  if (value === null || value === undefined) {
    return { success: false, errors: ["Value cannot be null or undefined"] };
  }

  const checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
  > = [];

  if (options.min !== undefined) {
    checks.push({
      kind: "min",
      value: options.min.value,
      inclusive: options.min.inclusive,
      message: options.min.message,
    });
  }

  if (options.max !== undefined) {
    checks.push({
      kind: "max",
      value: options.max.value,
      inclusive: options.max.inclusive,
      message: options.max.message,
    });
  }

  return parseNumberWithChecks(value, checks);
}