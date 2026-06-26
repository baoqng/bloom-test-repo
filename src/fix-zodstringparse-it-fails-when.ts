// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;
const ZodParsedType = z.ZodParsedType;

type ZodStringInput = {
  data: unknown;
};

type ZodStringContext = {
  addIssue: (issue: z.ZodIssueOptionalMessage) => void;
  common: {
    issues: z.ZodIssue[];
  };
};

const INVALID = z.INVALID;

function parseZodString(
  input: ZodStringInput,
  ctx: ZodStringContext
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

class FixedZodString extends z.ZodString {
  _parse(input: z.ParseInput): z.ParseReturnType<string> {
    const parsedType = this._getType(input);

    if (parsedType === ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      (z as any).addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ZodParsedType.undefined,
      });
      return INVALID;
    }

    return super._parse(input);
  }

  static create(params?: z.RawCreateParams): FixedZodString {
    const base = z.ZodString.create(params);
    return new FixedZodString({
      ...base._def,
    });
  }
}

export { FixedZodString, parseZodString };
export default FixedZodString;