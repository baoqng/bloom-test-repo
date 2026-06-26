// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type MinCheck = { kind: "min"; value: number; inclusive: boolean; message?: string };
type MaxCheck = { kind: "max"; value: number; inclusive: boolean; message?: string };
type MultipleOfCheck = { kind: "multipleOf"; value: number; message?: string };
type FiniteCheck = { kind: "finite"; message?: string };
type IntCheck = { kind: "int"; message?: string };

type ZodNumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

interface ZodNumberDef {
  checks: ZodNumberCheck[];
  typeName: "ZodNumber";
  coerce?: boolean;
}

class ZodNumberFixed extends z.ZodType<number, ZodNumberDef> {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const ctx = this._getOrReturnCtx(input);

    if (ctx.parsedType !== z.ZodParsedType.number) {
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
            message: check.message ?? undefined,
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
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: z.ZodParsedType.integer,
            received: z.ZodParsedType.float,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      }
    }

    if (hadError) {
      return z.INVALID;
    }

    return z.OK(input.data as number);
  }

  static create(params?: { coerce?: boolean }): ZodNumberFixed {
    return new ZodNumberFixed({
      checks: [],
      typeName: "ZodNumber" as "ZodNumber",
      coerce: params?.coerce ?? false,
    });
  }

  min(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumberFixed {
    const inclusive = options?.inclusive ?? true;
    return this._addCheck({
      kind: "min",
      value,
      inclusive,
      message: options?.message,
    });
  }

  max(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumberFixed {
    const inclusive = options?.inclusive ?? true;
    return this._addCheck({
      kind: "max",
      value,
      inclusive,
      message: options?.message,
    });
  }

  gte(value: number, message?: string): ZodNumberFixed {
    return this.min(value, { inclusive: true, message });
  }

  gt(value: number, message?: string): ZodNumberFixed {
    return this.min(value, { inclusive: false, message });
  }

  lte(value: number, message?: string): ZodNumberFixed {
    return this.max(value, { inclusive: true, message });
  }

  lt(value: number, message?: string): ZodNumberFixed {
    return this.max(value, { inclusive: false, message });
  }

  int(message?: string): ZodNumberFixed {
    return this._addCheck({ kind: "int", message });
  }

  multipleOf(value: number, message?: string): ZodNumberFixed {
    return this._addCheck({ kind: "multipleOf", value, message });
  }

  finite(message?: string): ZodNumberFixed {
    return this._addCheck({ kind: "finite", message });
  }

  private _addCheck(check: ZodNumberCheck): ZodNumberFixed {
    return new ZodNumberFixed({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
}

export { ZodNumberFixed };
export default ZodNumberFixed;