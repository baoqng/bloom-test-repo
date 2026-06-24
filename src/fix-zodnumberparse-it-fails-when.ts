```typescript
import { z, ZodIssueCode } from "zod";

class ZodNumberFixed extends z.ZodNumber {
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

    const data = input.data;
    
    if (data === null || data === undefined) {
      ctx = this._getOrReturnCtx(input, ctx);
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: z.ZodParsedType.null,
      });
      return z.INVALID;
    }

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive
          ? data < check.value
          : data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            message: check.message ?? "value out of range",
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive
          ? data > check.value
          : data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            message: check.message ?? "value out of range",
          });
          status.dirty();
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (data % check.value !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message,
          });
          status.dirty();
        }
      }
    }

    return { status: status.value, value: data };
  }

  static create(params?: z.RawCreateParams): ZodNumberFixed {
    return new ZodNumberFixed({
      checks: [],
      typeName: z.ZodFirstPartyTypeKind.ZodNumber,
      coerce: params?.coerce ?? false,
      ...z.processCreateParams(params),
    });
  }
}

export function createFixedZodNumber(params?: z.RawCreateParams): ZodNumberFixed {
  return ZodNumberFixed.create(params);
}

export { ZodNumberFixed };

export const fixedNumber = (params?: z.RawCreateParams) =>
  ZodNumberFixed.create(params);
```