```
import { z, ZodIssueCode, ZodParsedType } from "zod";

const originalParse = z.ZodString.prototype._parse;

z.ZodString.prototype._parse = function (input: z.ParseInput): z.ParseReturnType<string> {
  const ctx = this._getOrReturnCtx(input);

  if (input.data === undefined) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.string,
      received: ZodParsedType.undefined,
    });
    return z.INVALID;
  }

  return originalParse.call(this, input);
};

export { z };
export default z;
```