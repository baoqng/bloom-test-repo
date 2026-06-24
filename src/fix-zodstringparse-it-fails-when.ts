```
import { z, ZodIssueCode, ZodParsedType } from "zod";

const OriginalZodString = z.ZodString;

class PatchedZodString extends z.ZodString {
  _parse(input: z.ParseInput): z.ParseReturnType<string> {
    if (input.data === undefined) {
      const ctx = this._getOrReturnCtx(input);
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return z.INVALID;
    }
    return super._parse(input);
  }
}

export function patchZodString(): void {
  const proto = z.ZodString.prototype as unknown as {
    _parse: (input: z.ParseInput) => z.ParseReturnType<string>;
  };

  proto._parse = function (input: z.ParseInput): z.ParseReturnType<string> {
    if (input.data === undefined) {
      const ctx = this._getOrReturnCtx(input);
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return z.INVALID;
    }

    const originalProto = Object.getPrototypeOf(z.ZodString.prototype);
    if (originalProto && typeof originalProto._parse === "function") {
      return originalProto._parse.call(this, input);
    }

    const data = input.data;

    if (typeof data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    const self = this as unknown as { _def: { checks?: Array<{ kind: string; [key: string]: unknown }> } };
    const def = self._def;
    if (!def) {
      return { status: "valid", value: data };
    }

    const checks = def.checks;
    let status = new z.ParseStatus();

    if (checks && Array.isArray(checks)) {
      for (const check of checks) {
        if (!check) continue;

        if (check.kind === "min") {
          const min = check.value;
          if (typeof min === "number" && data.length < min) {
            const ctx = this._getOrReturnCtx(input, undefined);
            const message = check.message;
            ctx.addIssue({
              code: ZodIssueCode.too_small,
              minimum: min,
              type: "string",
              inclusive: true,
              exact: false,
              message: typeof message === "string" ? message : undefined,
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const max = check.value;
          if (typeof max === "number" && data.length > max) {
            const ctx = this._getOrReturnCtx(input, undefined);
            const message = check.message;
            ctx.addIssue({
              code: ZodIssueCode.too_big,
              maximum: max,
              type: "string",
              inclusive: true,
              exact: false,
              message: typeof message === "string" ? message : undefined,
            });
            status.dirty();
          }
        }
      }
    }

    return { status: status.value, value: data };
  };
}

export function createSafeZodString() {
  return {
    parse(value: unknown): string {
      if (value === undefined) {
        const result = z.string().safeParse(value);
        if (!result.success) {
          throw new Error(
            `ZodString parse error: received undefined, expected string. Issues: ${JSON.stringify(
              result.error.issues
            )}`
          );
        }
        return result.data;
      }
      return z.string().parse(value);
    },

    safeParse(value: unknown): z.SafeParseReturnType<string, string> {
      return z.string().safeParse(value);
    },
  };
}

export function parseStringWithUndefinedGuard(
  schema: z.ZodString,
  value: unknown
): z.SafeParseReturnType<string, string> {
  if (value === undefined) {
    const issue: z.ZodIssue = {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
      path: [],
      message: `Expected string, received undefined`,
    };
    return {
      success: false,
      error: new z.ZodError([issue]),
    };
  }
  return schema.safeParse(value);
}

export { PatchedZodString };
export { ZodIssueCode, ZodParsedType };
```