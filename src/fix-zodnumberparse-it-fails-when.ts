// bloom-deps: zod@^3

import { z } from "zod";
import {
  ZodIssueCode,
  ZodParsedType,
  addIssueToContext,
  type RefinementCtx,
} from "zod";

export function parseZodNumber(
  def: z.ZodNumberDef,
  input: { data: unknown; addIssue: RefinementCtx["addIssue"] }
): z.SafeParseReturnType<number, number> {
  const schema = z.number();
  return schema.safeParse(input.data);
}

export class ZodNumberFixed extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const parsedType = this._getType(input);

    if (parsedType !== ZodParsedType.number) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: "invalid_type" as const,
        expected: ZodParsedType.number,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    let ctx: z.ParseContext | undefined = undefined;

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const data = input.data;
        if (typeof data !== "number") continue;
        
        const tooSmall = check.inclusive
          ? data < check.value
          : data <= check.value;

        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: "too_small" as const,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "max") {
        const data = input.data;
        if (typeof data !== "number") continue;
        
        const tooBig = check.inclusive
          ? data > check.value
          : data >= check.value;

        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: "too_big" as const,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "int") {
        const data = input.data;
        if (typeof data === "number" && !Number.isInteger(data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: "invalid_type" as const,
            expected: "integer" as ZodParsedType,
            received: "float" as ZodParsedType,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "finite") {
        const data = input.data;
        if (typeof data === "number" && !Number.isFinite(data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: "not_finite" as const,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "multipleOf") {
        const data = input.data;
        if (typeof data === "number" && data % check.value !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: "not_multiple_of" as const,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
        }
      }
    }

    return z.OK(input.data as number);
  }

  static create(params?: z.RawCreateParams): ZodNumberFixed {
    const baseParams = typeof params === "object" && params !== null
      ? params
      : {};
    
    return new ZodNumberFixed({
      checks: [],
      typeName: z.ZodFirstPartyTypeKind.ZodNumber,
      coerce: baseParams.coerce ?? false,
      ...baseParams,
    });
  }
}

export function createFixedNumber(params?: z.RawCreateParams): ZodNumberFixed {
  return ZodNumberFixed.create(params);
}

export { z };