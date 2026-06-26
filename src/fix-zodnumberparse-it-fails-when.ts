// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type MinCheck = { kind: "min"; value: number; inclusive: boolean; message?: string };
type MaxCheck = { kind: "max"; value: number; inclusive: boolean; message?: string };
type MultipleOfCheck = { kind: "multipleOf"; value: number; message?: string };
type FiniteCheck = { kind: "finite"; message?: string };
type IntCheck = { kind: "int"; message?: string };

type ZodNumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

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
    code: ZodIssueCode;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    multipleOf?: number;
    message?: string;
  }) => void;
}

export function parseZodNumber(
  input: ParseInput,
  ctx: ParseContext,
  def: ZodNumberDef
): { status: "valid"; value: number } | { status: "invalid" } {
  let data = input.data;

  if (def.coerce) {
    data = Number(data);
  }

  if (typeof data !== "number" || isNaN(data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
    });
    return { status: "invalid" };
  }

  const num = data as number;
  let isInvalid = false;

  for (const check of def.checks) {
    if (check.kind === "min") {
      const minCheck = check as MinCheck;
      const tooSmall = minCheck.inclusive
        ? num < minCheck.value
        : num <= minCheck.value;

      if (tooSmall) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: minCheck.value,
          inclusive: minCheck.inclusive,
          message: minCheck.message ?? undefined,
        });
        isInvalid = true;
      }
    } else if (check.kind === "max") {
      const maxCheck = check as MaxCheck;
      const tooBig = maxCheck.inclusive
        ? num > maxCheck.value
        : num >= maxCheck.value;

      if (tooBig) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: maxCheck.value,
          inclusive: maxCheck.inclusive,
          message: maxCheck.message ?? undefined,
        });
        isInvalid = true;
      }
    } else if (check.kind === "multipleOf") {
      const multipleOfCheck = check as MultipleOfCheck;
      if (num % multipleOfCheck.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: multipleOfCheck.value,
          message: multipleOfCheck.message ?? undefined,
        });
        isInvalid = true;
      }
    } else if (check.kind === "finite") {
      const finiteCheck = check as FiniteCheck;
      if (!isFinite(num)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: finiteCheck.message ?? undefined,
        });
        isInvalid = true;
      }
    } else if (check.kind === "int") {
      const intCheck = check as IntCheck;
      if (!Number.isInteger(num)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_type,
          message: intCheck.message ?? undefined,
        });
        isInvalid = true;
      }
    }
  }

  if (isInvalid) {
    return { status: "invalid" };
  }

  return { status: "valid", value: num };
}

export function createNumberSchema(checks: ZodNumberCheck[], coerce = false) {
  const def: ZodNumberDef = {
    checks,
    typeName: "ZodNumber",
    coerce,
  };

  return {
    parse(data: unknown): number {
      const issues: {
        code: ZodIssueCode;
        type?: string;
        minimum?: number;
        maximum?: number;
        inclusive?: boolean;
        multipleOf?: number;
        message?: string;
      }[] = [];

      const ctx: ParseContext = {
        addIssue(issue) {
          issues.push(issue);
        },
      };

      const result = parseZodNumber({ data }, ctx, def);

      if (result.status === "invalid" || issues.length > 0) {
        throw new Error(
          issues.map((i) => i.message ?? i.code).join(", ") || "Invalid number",
          { cause: issues }
        );
      }

      return result.value;
    },

    safeParse(data: unknown): { success: true; data: number } | { success: false; error: Error } {
      try {
        const value = this.parse(data);
        return { success: true, data: value };
      } catch (err) {
        if (err instanceof Error) {
          return { success: false, error: err };
        }
        return { success: false, error: new Error("Unknown parse error", { cause: err }) };
      }
    },

    _def: def,
  };
}

export { ZodIssueCode };