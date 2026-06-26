// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

type ZodStringInput = {
  data: unknown;
};

type ParseContext = {
  addIssue: (issue: z.ZodIssueOptionalMessage) => void;
};

const INVALID = z.INVALID;

export function parseZodString(
  input: ZodStringInput,
  ctx: ParseContext
): z.ParseReturnType<string> {
  if (input.data === undefined) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
    });
    return INVALID;
  }

  if (typeof input.data !== "string") {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: z.getParsedType(input.data),
    });
    return INVALID;
  }

  return { status: "valid", value: input.data };
}

export class FixedZodString extends z.ZodString {
  _parse(input: z.ParseInput): z.ParseReturnType<string> {
    const ctx = this._getOrReturnCtx(input);

    if (input.data === undefined) {
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return INVALID;
    }

    if (typeof input.data !== "string") {
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: z.getParsedType(input.data),
      });
      return INVALID;
    }

    return super._parse(input);
  }

  static create(params?: z.RawCreateParams): FixedZodString {
    const base = z.string(params);
    return new FixedZodString({
      ...(base._def),
    });
  }
}

export function createFixedString(params?: z.RawCreateParams): FixedZodString {
  return FixedZodString.create(params);
}

export function patchZodStringParse(): void {
  const proto = z.ZodString.prototype as z.ZodString & {
    _parse: (input: z.ParseInput) => z.ParseReturnType<string>;
  };

  const originalParse = proto._parse;

  proto._parse = function (input: z.ParseInput): z.ParseReturnType<string> {
    const ctx = this._getOrReturnCtx(input);

    if (input.data === undefined) {
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return INVALID;
    }

    return originalParse.call(this, input);
  };
}