// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

type ZodNumberCheck =
  | { kind: "min"; value: number; inclusive: boolean; message?: string }
  | { kind: "max"; value: number; inclusive: boolean; message?: string }
  | { kind: "int"; message?: string }
  | { kind: "multipleOf"; value: number; message?: string }
  | { kind: "finite"; message?: string };

interface ZodNumberDef {
  checks: ZodNumberCheck[];
  typeName: string;
  coerce?: boolean;
}

interface ParseInput {
  data: unknown;
}

interface IssueData {
  code: string;
  type?: string;
  minimum?: number;
  maximum?: number;
  inclusive?: boolean;
  message?: string;
}

interface ParseContext {
  addIssue: (issue: IssueData) => void;
}

interface ParseReturnType {
  status: "valid" | "dirty" | "aborted";
  value?: unknown;
}

const ZodIssueCode = {
  invalid_type: "invalid_type",
  too_small: "too_small",
  too_big: "too_big",
  invalid_string: "invalid_string",
  not_multiple_of: "not_multiple_of",
  not_finite: "not_finite",
} as const;

function isNumber(val: unknown): val is number {
  return typeof val === "number" && !Number.isNaN(val);
}

function parseZodNumber(
  ctx: ParseContext,
  input: ParseInput,
  def: ZodNumberDef
): ParseReturnType {
  try {
    if (!isNumber(input.data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        message: `Expected number, received ${typeof input.data}`,
      });
      return { status: "aborted" };
    }

    let status: "valid" | "dirty" = "valid";

    for (const check of def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (tooSmall) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          status = "dirty";
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (tooBig) {
          ctx.addIssue({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          status = "dirty";
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            message: check.message ?? "Expected integer",
          });
          status = "dirty";
        }
      } else if (check.kind === "multipleOf") {
        const remainder = input.data % check.value;
        if (Math.abs(remainder) > Number.EPSILON) {
          ctx.addIssue({
            code: ZodIssueCode.not_multiple_of,
            message: check.message ?? `Must be a multiple of ${check.value}`,
          });
          status = "dirty";
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: check.message ?? "Must be finite",
          });
          status = "dirty";
        }
      }
    }

    return { status, value: input.data };
  } catch (error) {
    throw new ServiceError("parseZodNumber operation failed", { cause: error });
  }
}

function createZodNumberParser(def: ZodNumberDef) {
  return {
    parse(data: unknown): number {
      try {
        const issues: IssueData[] = [];
        const ctx: ParseContext = {
          addIssue(issue: IssueData) {
            issues.push(issue);
          },
        };

        const result = parseZodNumber(ctx, { data }, def);

        if (result.status === "aborted" || issues.length > 0) {
          const messages = issues
            .map((i) => i.message ?? i.code)
            .filter(Boolean)
            .join("; ");
          throw new ServiceError(`Validation failed: ${messages}`);
        }

        if (!isNumber(result.value)) {
          throw new ServiceError("Validation failed: result value is not a number");
        }

        return result.value;
      } catch (error) {
        if (error instanceof ServiceError) {
          throw error;
        }
        throw new ServiceError("parse operation failed", { cause: error });
      }
    },

    safeParse(
      data: unknown
    ): { success: true; data: number } | { success: false; issues: IssueData[] } {
      try {
        const issues: IssueData[] = [];
        const ctx: ParseContext = {
          addIssue(issue: IssueData) {
            issues.push(issue);
          },
        };

        const result = parseZodNumber(ctx, { data }, def);

        if (result.status === "aborted" || issues.length > 0) {
          return { success: false, issues };
        }

        if (!isNumber(result.value)) {
          return {
            success: false,
            issues: [{ code: ZodIssueCode.invalid_type, message: "Not a number" }],
          };
        }

        return { success: true, data: result.value };
      } catch (error) {
        throw new ServiceError("safeParse operation failed", { cause: error });
      }
    },
  };
}

function zodNumber(checks: ZodNumberCheck[] = []) {
  const def: ZodNumberDef = {
    checks,
    typeName: "ZodNumber",
  };

  const parser = createZodNumberParser(def);

  return {
    ...parser,
    min(value: number, options?: { inclusive?: boolean; message?: string }) {
      return zodNumber([
        ...checks,
        {
          kind: "min" as const,
          value,
          inclusive: options?.inclusive ?? true,
          message: options?.message,
        },
      ]);
    },
    max(value: number, options?: { inclusive?: boolean; message?: string }) {
      return zodNumber([
        ...checks,
        {
          kind: "max" as const,
          value,
          inclusive: options?.inclusive ?? true,
          message: options?.message,
        },
      ]);
    },
    int(options?: { message?: string }) {
      return zodNumber([
        ...checks,
        { kind: "int" as const, message: options?.message },
      ]);
    },
    multipleOf(value: number, options?: { message?: string }) {
      return zodNumber([
        ...checks,
        { kind: "multipleOf" as const, value, message: options?.message },
      ]);
    },
    finite(options?: { message?: string }) {
      return zodNumber([
        ...checks,
        { kind: "finite" as const, message: options?.message },
      ]);
    },
    _def: def,
    _parse(input: ParseInput, ctx: ParseContext): ParseReturnType {
      return parseZodNumber(ctx, input, def);
    },
  };
}

function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  if (page < 1 || limit < 1) {
    throw new ServiceError("Invalid pagination parameters");
  }
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export {
  ServiceError,
  ZodIssueCode,
  parseZodNumber,
  createZodNumberParser,
  zodNumber,
  filterByMinimumScore,
  paginateItems,
};

export type {
  ZodNumberCheck,
  ZodNumberDef,
  ParseInput,
  ParseContext,
  ParseReturnType,
  IssueData,
};