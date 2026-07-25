// bloom-deps: zod@^3

import { ZodError, ZodIssueCode, ZodType, ZodTypeAny } from "zod";

interface ParseContext {
  addIssue(issue: {
    code: ZodIssueCode;
    type: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    path?: (string | number)[];
    message?: string;
  }): void;
}

interface NumberCheckMin {
  kind: "min";
  value: number;
  inclusive: boolean;
  message?: string;
}

interface NumberCheckMax {
  kind: "max";
  value: number;
  inclusive: boolean;
  message?: string;
}

type NumberCheck = NumberCheckMin | NumberCheckMax;

interface ZodNumberDef {
  checks: NumberCheck[];
  [key: string]: unknown;
}

class ZodNumber {
  _def: ZodNumberDef;

  constructor(def: ZodNumberDef) {
    this._def = def;
  }

  _parse(input: { data: number }, ctx: ParseContext): { status: string; data?: number } {
    // Type check: ensure input is a number
    if (typeof input.data !== "number") {
      ctx.addIssue({
        code: "invalid_type" as ZodIssueCode,
        type: "number",
        path: [],
        message: `Expected number, received ${typeof input.data}`,
      });
      return { status: "aborted" };
    }

    // Process each check in this._def.checks
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        // For min check: if inclusive is true, value must be >= check.value
        // If inclusive is false, value must be > check.value
        // So we fail if: (inclusive && value < check.value) || (!inclusive && value <= check.value)
        const isTooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (isTooSmall) {
          ctx.addIssue({
            code: "too_small" as ZodIssueCode,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            path: [],
            message:
              check.message ||
              `Number must be ${check.inclusive ? "greater than or equal to" : "greater than"} ${check.value}`,
          });
          return { status: "aborted" };
        }
      } else if (check.kind === "max") {
        // For max check: if inclusive is true, value must be <= check.value
        // If inclusive is false, value must be < check.value
        // So we fail if: (inclusive && value > check.value) || (!inclusive && value >= check.value)
        const isTooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (isTooBig) {
          ctx.addIssue({
            code: "too_big" as ZodIssueCode,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            path: [],
            message:
              check.message ||
              `Number must be ${check.inclusive ? "less than or equal to" : "less than"} ${check.value}`,
          });
          return { status: "aborted" };
        }
      }
    }

    return { status: "success", data: input.data };
  }
}

export { ZodNumber, ZodNumberDef, NumberCheck, ParseContext };