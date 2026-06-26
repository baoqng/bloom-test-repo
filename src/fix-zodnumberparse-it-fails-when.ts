// bloom-deps: zod@^3

import { z, ZodIssueCode } from "zod";

type ZodNumberCheck =
  | { kind: "min"; value: number; inclusive: boolean; message?: string }
  | { kind: "max"; value: number; inclusive: boolean; message?: string }
  | { kind: "int"; message?: string }
  | { kind: "multipleOf"; value: number; message?: string }
  | { kind: "finite"; message?: string };

interface ZodNumberDef {
  checks: ZodNumberCheck[];
  typeName: "ZodNumber";
  coerce: boolean;
}

type ParseInput = {
  data: unknown;
  path: (string | number)[];
  parent: unknown;
};

type ParseContext = {
  addIssue: (issue: {
    code: string;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    message?: string;
    input?: unknown;
    path?: (string | number)[];
  }) => void;
};

type ParseReturnType =
  | { status: "valid"; value: number }
  | { status: "dirty"; value: number }
  | { status: "aborted" };

export function parseZodNumber(
  input: ParseInput,
  def: ZodNumberDef
): ParseReturnType {
  const ctx: ParseContext & { issues: unknown[]; status: string } = {
    issues: [],
    status: "valid",
    addIssue(issue) {
      this.issues.push(issue);
      this.status = "dirty";
    },
  };

  if (typeof input.data !== "number" || isNaN(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      message: `Expected number, received ${typeof input.data}`,
    });
    return { status: "aborted" };
  }

  const data = input.data as number;

  for (const check of def.checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive ? data < check.value : data <= check.value;
      if (tooSmall) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive ? data > check.value : data >= check.value;
      if (tooBig) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(data)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_type,
          message: check.message ?? "Expected integer",
        });
      }
    } else if (check.kind === "multipleOf") {
      if (data % check.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          message: check.message ?? undefined,
        });
      }
    } else if (check.kind === "finite") {
      if (!isFinite(data)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: check.message ?? undefined,
        });
      }
    }
  }

  if (ctx.status === "dirty") {
    return { status: "dirty", value: data };
  }

  return { status: "valid", value: data };
}

export function validateNumber(
  value: unknown,
  schema: z.ZodNumber
): { success: true; data: number } | { success: false; error: z.ZodError } {
  try {
    const result = schema.safeParse(value);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  } catch (err) {
    throw new Error("Failed to validate number", { cause: err });
  }
}

export function createNumberSchema(options?: {
  min?: { value: number; inclusive?: boolean; message?: string };
  max?: { value: number; inclusive?: boolean; message?: string };
  int?: boolean;
  multipleOf?: number;
  finite?: boolean;
}): z.ZodNumber {
  let schema = z.number();

  if (options?.min !== undefined) {
    const minOpts = options.min;
    const inclusive = minOpts.inclusive !== false;
    if (inclusive) {
      schema = minOpts.message !== undefined
        ? schema.min(minOpts.value, { message: minOpts.message })
        : schema.min(minOpts.value);
    } else {
      schema = minOpts.message !== undefined
        ? schema.gt(minOpts.value, { message: minOpts.message })
        : schema.gt(minOpts.value);
    }
  }

  if (options?.max !== undefined) {
    const maxOpts = options.max;
    const inclusive = maxOpts.inclusive !== false;
    if (inclusive) {
      schema = maxOpts.message !== undefined
        ? schema.max(maxOpts.value, { message: maxOpts.message })
        : schema.max(maxOpts.value);
    } else {
      schema = maxOpts.message !== undefined
        ? schema.lt(maxOpts.value, { message: maxOpts.message })
        : schema.lt(maxOpts.value);
    }
  }

  if (options?.int) {
    schema = schema.int();
  }

  if (options?.multipleOf !== undefined) {
    schema = schema.multipleOf(options.multipleOf);
  }

  if (options?.finite) {
    schema = schema.finite();
  }

  return schema;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter(num => num >= minimumThreshold);
}

export function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter(num => num <= maxThreshold);
}

export function filterByScoreRange(
  scores: number[],
  minScore: number,
  maxScore: number
): number[] {
  return scores.filter(score => score >= minScore && score <= maxScore);
}

export function paginateItems<T>(
  items: T[],
  page: number,
  limit: number
): T[] {
  if (page < 1) {
    throw new Error("Page must be >= 1");
  }
  if (limit < 1) {
    throw new Error("Limit must be >= 1");
  }
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export function filterByDateRange<T extends { createdAt: Date }>(
  events: T[],
  startDate: Date,
  endDate: Date
): T[] {
  return events.filter(
    event => event.createdAt >= startDate && event.createdAt <= endDate
  );
}

export function isValidPrice(price: number, minPrice: number): boolean {
  return price >= minPrice;
}

export function isWithinMaxPrice(price: number, maxPrice: number): boolean {
  return price <= maxPrice;
}

export function isValidAmount(amount: number, minAmount: number, maxAmount: number): boolean {
  return amount >= minAmount && amount <= maxAmount;
}

export function isValidQuantity(quantity: number, minQuantity: number, maxQuantity: number): boolean {
  return quantity >= minQuantity && quantity <= maxQuantity;
}