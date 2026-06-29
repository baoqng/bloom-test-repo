// bloom-deps: zod@^3

import { z } from "zod";

const ZodParsedType = z.ZodParsedType;
const ZodIssueCode = z.ZodIssueCode;

type RawCreateParams = z.RawCreateParams;

function getParsedType(data: unknown): z.ZodParsedType {
  if (data === undefined) return ZodParsedType.undefined;
  if (data === null) return ZodParsedType.null;
  if (typeof data === "string") return ZodParsedType.string;
  if (typeof data === "number") {
    return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
  }
  if (typeof data === "boolean") return ZodParsedType.boolean;
  if (typeof data === "bigint") return ZodParsedType.bigint;
  if (typeof data === "symbol") return ZodParsedType.symbol;
  if (typeof data === "function") return ZodParsedType.function;
  if (Array.isArray(data)) return ZodParsedType.array;
  if (data instanceof Promise) return ZodParsedType.promise;
  if (data instanceof Date) return ZodParsedType.date;
  if (data instanceof Map) return ZodParsedType.map;
  if (data instanceof Set) return ZodParsedType.set;
  if (typeof data === "object") return ZodParsedType.object;
  return ZodParsedType.unknown;
}

export class FixedZodString extends z.ZodString {
  _parse(input: z.ParseInput): z.ParseReturnType<string> {
    const parsedType = getParsedType(input.data);

    if (input.data === undefined) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return z.INVALID;
    }

    if (parsedType !== ZodParsedType.string) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: parsedType,
      });
      return z.INVALID;
    }

    return super._parse(input);
  }

  static override create(params?: RawCreateParams): FixedZodString {
    const instance = new FixedZodString({
      checks: [],
      typeName: z.ZodFirstPartyTypeKind.ZodString,
      coerce: (params as { coerce?: boolean } | undefined)?.coerce ?? false,
      ...params,
    });
    return instance;
  }
}

export function fixedString(params?: RawCreateParams): FixedZodString {
  return FixedZodString.create(params);
}

export { z };