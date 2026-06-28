// bloom-deps: zod@^3

import { z } from "zod";

function createZodNumber() {
  return z.number();
}

class FixedZodNumber {
  private _def: {
    checks: Array<
      | { kind: "min"; value: number; inclusive: boolean; message?: string }
      | { kind: "max"; value: number; inclusive: boolean; message?: string }
      | { kind: "int"; message?: string }
      | { kind: "multipleOf"; value: number; message?: string }
      | { kind: "finite"; message?: string }
    >;
  };

  constructor(checks: FixedZodNumber["_def"]["checks"] = []) {
    this._def = { checks };
  }

  _parse(input: unknown): { success: boolean; issues: Array<{ code: string; type?: string; minimum?: number; maximum?: number; inclusive?: boolean; message: string }> } {
    const issues: Array<{ code: string; type?: string; minimum?: number; maximum?: number; inclusive?: boolean; message: string }> = [];

    if (typeof input !== "number" || Number.isNaN(input)) {
      issues.push({ code: "invalid_type", message: "Expected number, received " + typeof input });
      return { success: false, issues };
    }

    const data = input as number;

    const ctx = {
      addIssue: (issue: { code: string; type?: string; minimum?: number; maximum?: number; inclusive?: boolean; message: string }) => {
        issues.push(issue);
      },
    };

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const failsMin = check.inclusive ? data < check.value : data <= check.value;
        if (failsMin) {
          ctx.addIssue({
            code: "too_small",
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? `Number must be greater than${check.inclusive ? " or equal to" : ""} ${check.value}`,
          });
        }
      } else if (check.kind === "max") {
        const failsMax = check.inclusive ? data > check.value : data >= check.value;
        if (failsMax) {
          ctx.addIssue({
            code: "too_big",
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? `Number must be less than${check.inclusive ? " or equal to" : ""} ${check.value}`,
          });
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(data)) {
          ctx.addIssue({
            code: "not_multiple_of",
            message: check.message ?? "Expected integer, received float",
          });
        }
      } else if (check.kind === "multipleOf") {
        if (data % check.value !== 0) {
          ctx.addIssue({
            code: "not_multiple_of",
            message: check.message ?? `Number must be a multiple of ${check.value}`,
          });
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(data)) {
          ctx.addIssue({
            code: "not_finite",
            message: check.message ?? "Number must be finite",
          });
        }
      }
    }

    return { success: issues.length === 0, issues };
  }

  min(value: number, options?: { inclusive?: boolean; message?: string }): FixedZodNumber {
    const inclusive = options?.inclusive !== false;
    return new FixedZodNumber([
      ...this._def.checks,
      { kind: "min", value, inclusive, message: options?.message },
    ]);
  }

  max(value: number, options?: { inclusive?: boolean; message?: string }): FixedZodNumber {
    const inclusive = options?.inclusive !== false;
    return new FixedZodNumber([
      ...this._def.checks,
      { kind: "max", value, inclusive, message: options?.message },
    ]);
  }

  gte(value: number, message?: string): FixedZodNumber {
    return this.min(value, { inclusive: true, message });
  }

  gt(value: number, message?: string): FixedZodNumber {
    return this.min(value, { inclusive: false, message });
  }

  lte(value: number, message?: string): FixedZodNumber {
    return this.max(value, { inclusive: true, message });
  }

  lt(value: number, message?: string): FixedZodNumber {
    return this.max(value, { inclusive: false, message });
  }

  int(message?: string): FixedZodNumber {
    return new FixedZodNumber([
      ...this._def.checks,
      { kind: "int", message },
    ]);
  }

  multipleOf(value: number, message?: string): FixedZodNumber {
    return new FixedZodNumber([
      ...this._def.checks,
      { kind: "multipleOf", value, message },
    ]);
  }

  finite(message?: string): FixedZodNumber {
    return new FixedZodNumber([
      ...this._def.checks,
      { kind: "finite", message },
    ]);
  }
}

function parseNumber(
  input: unknown,
  schema: FixedZodNumber
): { success: true; data: number } | { success: false; issues: Array<{ code: string; type?: string; minimum?: number; maximum?: number; inclusive?: boolean; message: string }> } {
  const result = schema._parse(input);
  if (result.success) {
    return { success: true, data: input as number };
  }
  return { success: false, issues: result.issues };
}

function isValidNumber(input: unknown): input is number {
  return typeof input === "number" && !Number.isNaN(input);
}

function isValidPrice(price: unknown, minPrice: number, maxPrice: number): boolean {
  if (!isValidNumber(price)) {
    return false;
  }
  return price >= minPrice && price <= maxPrice;
}

function isValidQuantity(quantity: unknown, minQuantity: number, maxQuantity: number): boolean {
  if (!isValidNumber(quantity)) {
    return false;
  }
  return quantity >= minQuantity && quantity <= maxQuantity;
}

function isValidScore(score: unknown, minScore: number, maxScore: number): boolean {
  if (!isValidNumber(score)) {
    return false;
  }
  return score >= minScore && score <= maxScore;
}

function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter((num) => num <= maxThreshold);
}

function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

const filterByDateRange = (
  events: Array<{ createdAt: Date; [key: string]: unknown }>,
  startDate: Date,
  endDate: Date
): Array<{ createdAt: Date; [key: string]: unknown }> => {
  return events.filter(
    (event) => event.createdAt >= startDate && event.createdAt <= endDate
  );
};

export {
  FixedZodNumber,
  parseNumber,
  isValidNumber,
  isValidPrice,
  isValidQuantity,
  isValidScore,
  filterByMaxThreshold,
  filterByMinimumScore,
  paginateItems,
  filterByDateRange,
  createZodNumber,
};