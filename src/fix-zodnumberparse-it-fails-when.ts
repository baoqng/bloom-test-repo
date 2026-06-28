// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type MinCheck = {
  kind: "min";
  value: number;
  inclusive: boolean;
  message?: string;
};

type MaxCheck = {
  kind: "max";
  value: number;
  inclusive: boolean;
  message?: string;
};

type MultipleOfCheck = {
  kind: "multipleOf";
  value: number;
  message?: string;
};

type FiniteCheck = {
  kind: "finite";
  message?: string;
};

type IntCheck = {
  kind: "int";
  message?: string;
};

type NumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

interface ZodNumberDef {
  checks: NumberCheck[];
  coerce?: boolean;
}

interface ParseInput {
  data: unknown;
}

interface ParseContext {
  addIssue: (issue: Record<string, unknown>) => void;
}

interface ParseReturnType {
  status: string;
  value?: unknown;
}

const INVALID: ParseReturnType = { status: "aborted" };

function OK(value: unknown): ParseReturnType {
  return { status: "valid", value };
}

function isNumber(val: unknown): val is number {
  return typeof val === "number";
}

export class ZodNumberFixed {
  _def: ZodNumberDef;

  constructor(def: ZodNumberDef) {
    this._def = def;
  }

  _parse(input: ParseInput, ctx: ParseContext): ParseReturnType {
    if (this._def.coerce) {
      input = { data: Number(input.data) };
    }

    if (!isNumber(input.data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        expected: "number",
        received: typeof input.data,
      });
      return INVALID;
    }

    let hadError = false;

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const minCheck = check as MinCheck;
        const tooSmall = minCheck.inclusive
          ? input.data < minCheck.value
          : input.data <= minCheck.value;

        if (tooSmall) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: minCheck.value,
            inclusive: minCheck.inclusive,
            message: minCheck.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "max") {
        const maxCheck = check as MaxCheck;
        const tooBig = maxCheck.inclusive
          ? input.data > maxCheck.value
          : input.data >= maxCheck.value;

        if (tooBig) {
          ctx.addIssue({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: maxCheck.value,
            inclusive: maxCheck.inclusive,
            message: maxCheck.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: (check as IntCheck).message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "multipleOf") {
        const multipleCheck = check as MultipleOfCheck;
        if (input.data % multipleCheck.value !== 0) {
          ctx.addIssue({
            code: ZodIssueCode.not_multiple_of,
            multipleOf: multipleCheck.value,
            message: multipleCheck.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: (check as FiniteCheck).message ?? undefined,
          });
          hadError = true;
        }
      }
    }

    if (hadError) {
      return INVALID;
    }

    return OK(input.data);
  }

  static create(checks: NumberCheck[] = [], coerce = false): ZodNumberFixed {
    return new ZodNumberFixed({ checks, coerce });
  }
}

export function parseNumber(
  value: unknown,
  checks: NumberCheck[] = [],
  coerce = false
): { success: true; data: number } | { success: false; errors: Record<string, unknown>[] } {
  const issues: Record<string, unknown>[] = [];

  const ctx: ParseContext = {
    addIssue(issue: Record<string, unknown>) {
      issues.push(issue);
    },
  };

  const parser = ZodNumberFixed.create(checks, coerce);
  const result = parser._parse({ data: value }, ctx);

  if (result.status === "valid" && isNumber(result.value)) {
    return { success: true, data: result.value };
  }

  return { success: false, errors: issues };
}

export function zodNumberWithRange(
  min?: number,
  max?: number,
  options?: {
    minInclusive?: boolean;
    maxInclusive?: boolean;
    minMessage?: string;
    maxMessage?: string;
  }
): z.ZodNumber {
  let schema = z.number();

  if (min !== undefined) {
    const inclusive = options?.minInclusive ?? true;
    if (inclusive) {
      schema = schema.min(min, options?.minMessage);
    } else {
      schema = schema.gt(min, options?.minMessage);
    }
  }

  if (max !== undefined) {
    const inclusive = options?.maxInclusive ?? true;
    if (inclusive) {
      schema = schema.max(max, options?.maxMessage);
    } else {
      schema = schema.lt(max, options?.maxMessage);
    }
  }

  return schema;
}

export function validateNumericInput(input: unknown): number {
  if (!isNumber(input)) {
    throw new Error(`Expected number, got ${typeof input}`, {
      cause: new TypeError(`Invalid type: ${typeof input}`),
    });
  }
  return input;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter((num) => num <= maxThreshold);
}

export function filterByScoreRange(
  scores: number[],
  minScore: number,
  maxScore: number
): number[] {
  return scores.filter((score) => score >= minScore && score <= maxScore);
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export function isValidPrice(price: number, minPrice: number, maxPrice?: number): boolean {
  if (price >= minPrice) {
    if (maxPrice !== undefined) {
      return price <= maxPrice;
    }
    return true;
  }
  return false;
}