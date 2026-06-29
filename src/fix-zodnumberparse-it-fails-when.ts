// bloom-deps: zod@^3

import { z } from "zod";

export type MinCheck = {
  kind: "min";
  value: number;
  inclusive: boolean;
  message?: string;
};

export type MaxCheck = {
  kind: "max";
  value: number;
  inclusive: boolean;
  message?: string;
};

export type MultipleOfCheck = {
  kind: "multipleOf";
  value: number;
  message?: string;
};

export type FiniteCheck = {
  kind: "finite";
  message?: string;
};

export type IntCheck = {
  kind: "int";
  message?: string;
};

export type NumberCheck =
  | MinCheck
  | MaxCheck
  | MultipleOfCheck
  | FiniteCheck
  | IntCheck;

export type ZodNumberDef = {
  checks: NumberCheck[];
  coerce?: boolean;
};

export type ParseInput = {
  data: unknown;
};

export type IssueData = {
  code: string;
  [key: string]: unknown;
};

export type ParseContext = {
  addIssue: (issue: IssueData) => void;
};

export type ParseReturnType<T> = {
  status: "valid" | "dirty" | "aborted";
  value?: T;
};

export const ZodIssueCode = {
  too_small: "too_small",
  too_big: "too_big",
  not_multiple_of: "not_multiple_of",
  not_finite: "not_finite",
  invalid_type: "invalid_type",
} as const;

export type ZodIssueCodes = typeof ZodIssueCode;

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

function parseNumber(
  input: ParseInput,
  def: ZodNumberDef,
  ctx: ParseContext
): ParseReturnType<number> {
  try {
    if (typeof input.data !== "number" || isNaN(input.data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: "number",
        received: typeof input.data,
      });
      return { status: "aborted" };
    }

    const data = input.data as number;
    let isValid = true;

    for (const check of def.checks) {
      if (check.kind === "min") {
        if (check.inclusive ? data < check.value : data <= check.value) {
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
        if (check.inclusive ? data > check.value : data >= check.value) {
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
        if (!Number.isInteger(data)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            message: check.message ?? "Expected integer",
          });
          isValid = false;
        }
      } else if (check.kind === "multipleOf") {
        if (data % check.value !== 0) {
          ctx.addIssue({
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
          isValid = false;
        }
      } else if (check.kind === "finite") {
        if (!isFinite(data)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: check.message ?? undefined,
          });
          isValid = false;
        }
      }
    }

    if (!isValid) {
      return { status: "dirty", value: data };
    }

    return { status: "valid", value: data };
  } catch (error) {
    throw new ServiceError("parseNumber failed", { cause: error });
  }
}

export function validateNumberWithChecks(
  value: unknown,
  checks: NumberCheck[]
): { success: boolean; issues: IssueData[]; value?: number } {
  try {
    const issues: IssueData[] = [];
    const ctx: ParseContext = {
      addIssue: (issue: IssueData) => {
        issues.push(issue);
      },
    };

    const input: ParseInput = { data: value };
    const def: ZodNumberDef = { checks };
    const result = parseNumber(input, def, ctx);

    if (result.status === "valid") {
      return { success: true, issues: [], value: result.value };
    }

    return { success: false, issues, value: result.value };
  } catch (error) {
    throw new ServiceError("validateNumberWithChecks failed", { cause: error });
  }
}

export function createZodNumberValidator(checks: NumberCheck[]) {
  return {
    parse(value: unknown): number {
      try {
        const result = validateNumberWithChecks(value, checks);
        if (!result.success) {
          throw new ServiceError("Validation failed", {
            cause: result.issues,
          });
        }
        if (result.value === undefined) {
          throw new ServiceError("No value returned from validation");
        }
        return result.value;
      } catch (error) {
        if (error instanceof ServiceError) {
          throw error;
        }
        throw new ServiceError("createZodNumberValidator.parse failed", {
          cause: error,
        });
      }
    },
    safeParse(value: unknown): { success: true; data: number } | { success: false; issues: IssueData[] } {
      try {
        const result = validateNumberWithChecks(value, checks);
        if (result.success && result.value !== undefined) {
          return { success: true, data: result.value };
        }
        return { success: false, issues: result.issues };
      } catch (error) {
        throw new ServiceError("createZodNumberValidator.safeParse failed", {
          cause: error,
        });
      }
    },
  };
}

export function zodNumberParseWithRangeValidation(
  schema: z.ZodNumber,
  value: unknown
): { success: true; data: number } | { success: false; error: z.ZodError } {
  try {
    const result = schema.safeParse(value);
    return result;
  } catch (error) {
    throw new ServiceError("zodNumberParseWithRangeValidation failed", {
      cause: error,
    });
  }
}

export function buildMinCheck(
  value: number,
  inclusive: boolean,
  message?: string
): MinCheck {
  return { kind: "min", value, inclusive, message };
}

export function buildMaxCheck(
  value: number,
  inclusive: boolean,
  message?: string
): MaxCheck {
  return { kind: "max", value, inclusive, message };
}

export function filterByMinimumScore(
  scores: number[],
  minimumThreshold: number
): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function filterByMaxThreshold(
  numbers: number[],
  maxThreshold: number
): number[] {
  return numbers.filter((num) => num <= maxThreshold);
}

export function filterByScoreRange(
  scores: number[],
  minScore: number,
  maxScore: number
): number[] {
  return scores.filter((score) => score >= minScore && score <= maxScore);
}

export function filterByPriceRange(
  prices: number[],
  minPrice: number,
  maxPrice: number
): number[] {
  return prices.filter((price) => price >= minPrice && price <= maxPrice);
}

export type RangeEvent = {
  id: string;
  createdAt: Date;
};

export function filterByDateRange(
  events: RangeEvent[],
  startDate: Date,
  endDate: Date
): RangeEvent[] {
  return events.filter(
    (event) => event.createdAt >= startDate && event.createdAt <= endDate
  );
}

export function paginateItems<T>(
  items: T[],
  page: number,
  limit: number
): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}