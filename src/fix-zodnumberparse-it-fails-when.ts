// bloom-deps: zod@^3

import { z } from "zod";

type ZodNumberCheck =
  | { kind: "min"; value: number; inclusive: boolean; message?: string }
  | { kind: "max"; value: number; inclusive: boolean; message?: string }
  | { kind: "int"; message?: string }
  | { kind: "multipleOf"; value: number; message?: string }
  | { kind: "finite"; message?: string };

interface ZodNumberDef {
  checks: ZodNumberCheck[];
  typeName: "ZodNumber";
  coerce?: boolean;
}

interface ParseInput {
  data: unknown;
}

interface ParseContext {
  addIssue: (issue: {
    code: string;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    message?: string;
    input?: unknown;
  }) => void;
}

const ZodIssueCode = {
  too_small: "too_small",
  too_big: "too_big",
  invalid_type: "invalid_type",
  not_multiple_of: "not_multiple_of",
  not_finite: "not_finite",
} as const;

function parseZodNumber(
  def: ZodNumberDef,
  input: ParseInput,
  ctx: ParseContext
): { status: "valid"; value: number } | { status: "invalid" } {
  try {
    let data = input.data;

    if (def.coerce) {
      try {
        data = Number(data);
      } catch (error) {
        throw new Error("Coercion failed", { cause: error });
      }
    }

    if (typeof data !== "number" || isNaN(data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        message: `Expected number, received ${typeof data}`,
      });
      return { status: "invalid" };
    }

    const numData = data as number;
    let isValid = true;

    for (const check of def.checks) {
      if (check.kind === "min") {
        if (check.inclusive ? numData < check.value : numData <= check.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          isValid = false;
        }
      } else if (check.kind === "max") {
        if (check.inclusive ? numData > check.value : numData >= check.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          isValid = false;
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(numData)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            message: check.message ?? "Expected integer",
          });
          isValid = false;
        }
      } else if (check.kind === "multipleOf") {
        if (numData % check.value !== 0) {
          ctx.addIssue({
            code: ZodIssueCode.not_multiple_of,
            message: check.message ?? `Number must be a multiple of ${check.value}`,
          });
          isValid = false;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(numData)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: check.message ?? "Number must be finite",
          });
          isValid = false;
        }
      }
    }

    if (!isValid) {
      return { status: "invalid" };
    }

    return { status: "valid", value: numData };
  } catch (error) {
    throw new Error("ZodNumber._parse() failed", { cause: error });
  }
}

function createZodNumberParser(checks: ZodNumberCheck[], coerce?: boolean) {
  const def: ZodNumberDef = {
    checks,
    typeName: "ZodNumber",
    coerce,
  };

  return {
    parse(data: unknown): number {
      const issues: ReturnType<typeof createIssue>[] = [];

      function createIssue(issue: Parameters<ParseContext["addIssue"]>[0]) {
        return issue;
      }

      const ctx: ParseContext = {
        addIssue(issue) {
          issues.push(createIssue(issue));
        },
      };

      const result = parseZodNumber(def, { data }, ctx);

      if (result.status === "invalid" || issues.length > 0) {
        throw new Error(
          `Validation failed: ${issues.map((i) => i.message ?? i.code).join(", ")}`
        );
      }

      return result.value;
    },
    safeParse(data: unknown): { success: true; data: number } | { success: false; error: { issues: object[] } } {
      const issues: object[] = [];

      const ctx: ParseContext = {
        addIssue(issue) {
          issues.push(issue);
        },
      };

      try {
        const result = parseZodNumber(def, { data }, ctx);

        if (result.status === "invalid" || issues.length > 0) {
          return { success: false, error: { issues } };
        }

        return { success: true, data: result.value };
      } catch (error) {
        throw new Error("safeParse failed", { cause: error });
      }
    },
  };
}

export { parseZodNumber, createZodNumberParser, ZodIssueCode };
export type { ZodNumberDef, ZodNumberCheck, ParseInput, ParseContext };