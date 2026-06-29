// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type MinCheck = { kind: "min"; value: number; inclusive: boolean; message?: string };
type MaxCheck = { kind: "max"; value: number; inclusive: boolean; message?: string };
type MultipleOfCheck = { kind: "multipleOf"; value: number; message?: string };
type FiniteCheck = { kind: "finite"; message?: string };
type IntCheck = { kind: "int"; message?: string };

type ZodNumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

function isMinCheck(check: ZodNumberCheck): check is MinCheck {
  return check.kind === "min";
}

function isMaxCheck(check: ZodNumberCheck): check is MaxCheck {
  return check.kind === "max";
}

function isMultipleOfCheck(check: ZodNumberCheck): check is MultipleOfCheck {
  return check.kind === "multipleOf";
}

function isFiniteCheck(check: ZodNumberCheck): check is FiniteCheck {
  return check.kind === "finite";
}

function isIntCheck(check: ZodNumberCheck): check is IntCheck {
  return check.kind === "int";
}

function isValidPrice(price: number, minPrice: number): boolean {
  return price >= minPrice;
}

function isWithinMaxPrice(price: number, maxPrice: number): boolean {
  return price <= maxPrice;
}

function isWithinMinAmount(amount: number, minAmount: number): boolean {
  return amount >= minAmount;
}

function isWithinMaxAmount(amount: number, maxAmount: number): boolean {
  return amount <= maxAmount;
}

function isWithinMinTotal(total: number, minTotal: number): boolean {
  return total >= minTotal;
}

function isWithinMaxTotal(total: number, maxTotal: number): boolean {
  return total <= maxTotal;
}

function isAboveMinQuantity(quantity: number, minQuantity: number): boolean {
  return quantity >= minQuantity;
}

function isWithinMaxQuantity(quantity: number, maxQuantity: number): boolean {
  return quantity <= maxQuantity;
}

function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

interface ParseContext {
  data: unknown;
  addIssue: (issue: {
    code: string;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    message?: string;
    multipleOf?: number;
  }) => void;
}

type ParseResult =
  | { success: true; data: number }
  | { success: false; error: string };

function parseZodNumber(
  checks: ZodNumberCheck[],
  ctx: ParseContext
): ParseResult {
  if (typeof ctx.data !== "number" || isNaN(ctx.data)) {
    return { success: false, error: "Expected number, received " + typeof ctx.data };
  }

  const value = ctx.data;

  for (const check of checks) {
    if (isMinCheck(check)) {
      const fails = check.inclusive ? value < check.value : value <= check.value;
      if (fails) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
      }
    } else if (isMaxCheck(check)) {
      const fails = check.inclusive ? value > check.value : value >= check.value;
      if (fails) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
      }
    } else if (isMultipleOfCheck(check)) {
      if (value % check.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message ?? undefined,
        });
      }
    } else if (isFiniteCheck(check)) {
      if (!isFinite(value)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: check.message ?? undefined,
        });
      }
    } else if (isIntCheck(check)) {
      if (!Number.isInteger(value)) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: 1,
          message: check.message ?? undefined,
        });
      }
    }
  }

  return { success: true, data: value };
}

async function validateNumber(
  schema: z.ZodNumber,
  input: unknown
): Promise<ParseResult> {
  try {
    const result = await schema.safeParseAsync(input);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", "),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown validation error";
    throw new Error(`validateNumber failed: ${message}`);
  }
}

function guardedProperty<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): T[K] | undefined {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  return obj[key];
}

function validateQueryParam(param: string | undefined, name: string): string {
  if (param === undefined || param === null) {
    throw new Error(`Missing required query parameter: ${name}`);
  }
  if (typeof param !== "string") {
    throw new Error(`Query parameter ${name} must be a string`);
  }
  return param;
}

function validateNumericQueryParam(
  param: string | undefined,
  name: string
): number {
  const str = validateQueryParam(param, name);
  const num = Number(str);
  if (isNaN(num)) {
    throw new Error(`Query parameter ${name} must be a valid number`);
  }
  return num;
}

const zodNumberChecks = {
  parseWithChecks: parseZodNumber,
};

export {
  zodNumberChecks,
  parseZodNumber,
  validateNumber,
  paginateItems,
  isValidPrice,
  isWithinMaxPrice,
  isWithinMinAmount,
  isWithinMaxAmount,
  isWithinMinTotal,
  isWithinMaxTotal,
  isAboveMinQuantity,
  isWithinMaxQuantity,
  guardedProperty,
  validateQueryParam,
  validateNumericQueryParam,
  isMinCheck,
  isMaxCheck,
  isMultipleOfCheck,
  isFiniteCheck,
  isIntCheck,
};

export type {
  ZodNumberCheck,
  MinCheck,
  MaxCheck,
  MultipleOfCheck,
  FiniteCheck,
  IntCheck,
  ParseContext,
  ParseResult,
};