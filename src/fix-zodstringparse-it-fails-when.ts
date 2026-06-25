```
import { z } from "zod";

const originalParse = (z.ZodString.prototype as any)._parse;

(z.ZodString.prototype as any)._parse = function (input: any) {
  const ctx = this._getOrReturnCtx(input);

  if (ctx === null || ctx === undefined) {
    return z.INVALID;
  }

  if (input.data === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: z.ZodParsedType.string,
      received: z.ZodParsedType.undefined,
    });
    return z.INVALID;
  }

  return originalParse.call(this, input);
};

export { z };
```