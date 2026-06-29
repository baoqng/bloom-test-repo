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

const INVALID = z.NEVER;

function zodStringParse(
  input: ZodStringInput,
  ctx: ParseContext
): string | typeof INVALID {
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

  return input.data;
}

export { zodStringParse, ZodIssueCode, ZodParsedType, INVALID };
export type { ZodStringInput, ParseContext };