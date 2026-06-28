// bloom-deps: zod@^3

import { z } from "zod";

export function parseNumber(
  schema: z.ZodNumber,
  value: unknown
): z.SafeParseReturnType<number, number> {
  return schema.safeParse(value);
}

export function createNumberSchema(options?: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
}): z.ZodNumber {
  let schema = z.number();

  if (options?.min !== undefined) {
    const min = options.min;
    if (min.inclusive) {
      schema = min.message !== undefined
        ? schema.min(min.value, { message: min.message })
        : schema.min(min.value);
    } else {
      schema = min.message !== undefined
        ? schema.gt(min.value, { message: min.message })
        : schema.gt(min.value);
    }
  }

  if (options?.max !== undefined) {
    const max = options.max;
    if (max.inclusive) {
      schema = max.message !== undefined
        ? schema.max(max.value, { message: max.message })
        : schema.max(max.value);
    } else {
      schema = max.message !== undefined
        ? schema.lt(max.value, { message: max.message })
        : schema.lt(max.value);
    }
  }

  return schema;
}

export function validateNumberWithChecks(
  value: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "int"; message?: string }
    | { kind: "multipleOf"; value: number; message?: string }
    | { kind: "finite"; message?: string }
  >
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  if (typeof value !== "number" || isNaN(value)) {
    return {
      success: false,
      errors: [
        {
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: typeof value === "number" ? "nan" : (typeof value as z.ZodIssueCode),
          path: [],
          message: "Expected number, received " + typeof value,
        } as z.ZodIssue,
      ],
    };
  }

  const issues: z.ZodIssue[] = [];
  const data = value as number;

  for (const check of checks) {
    if (check.kind === "min") {
      if (check.inclusive ? data < check.value : data <= check.value) {
        issues.push({
          code: z.ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? (check.inclusive
            ? `Number must be greater than or equal to ${check.value}`
            : `Number must be greater than ${check.value}`),
          path: [],
        } as z.ZodIssue);
      }
    } else if (check.kind === "max") {
      if (check.inclusive ? data > check.value : data >= check.value) {
        issues.push({
          code: z.ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? (check.inclusive
            ? `Number must be less than or equal to ${check.value}`
            : `Number must be less than ${check.value}`),
          path: [],
        } as z.ZodIssue);
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(data)) {
        issues.push({
          code: z.ZodIssueCode.invalid_type,
          expected: "integer",
          received: "float",
          message: check.message ?? "Expected integer, received float",
          path: [],
        } as unknown as z.ZodIssue);
      }
    } else if (check.kind === "multipleOf") {
      if (data % check.value !== 0) {
        issues.push({
          code: z.ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message ?? `Number must be a multiple of ${check.value}`,
          path: [],
        } as z.ZodIssue);
      }
    } else if (check.kind === "finite") {
      if (!isFinite(data)) {
        issues.push({
          code: z.ZodIssueCode.not_finite,
          message: check.message ?? "Number must be finite",
          path: [],
        } as z.ZodIssue);
      }
    }
  }

  if (issues.length > 0) {
    return { success: false, errors: issues };
  }

  return { success: true, data };
}

export function validateRange(
  value: unknown,
  min: number,
  max: number,
  options?: { minInclusive?: boolean; maxInclusive?: boolean }
): boolean {
  if (typeof value !== "number" || isNaN(value)) {
    return false;
  }

  const minInclusive = options?.minInclusive ?? true;
  const maxInclusive = options?.maxInclusive ?? true;

  const meetsMin = minInclusive ? value >= min : value > min;
  const meetsMax = maxInclusive ? value <= max : value < max;

  return meetsMin && meetsMax;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter((num) => num <= maxThreshold);
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export function isValidPrice(price: number, minPrice: number, maxPrice?: number): boolean {
  if (maxPrice !== undefined) {
    return price >= minPrice && price <= maxPrice;
  }
  return price >= minPrice;
}

export function filterByDateRange<T extends { createdAt: Date }>(
  events: T[],
  startDate: Date,
  endDate: Date
): T[] {
  return events.filter(
    (event) => event.createdAt >= startDate && event.createdAt <= endDate
  );
}