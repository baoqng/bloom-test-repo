// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;

export function parseNumber(
  schema: z.ZodNumber,
  value: unknown
): z.SafeParseReturnType<number, number> {
  // Reject Infinity and -Infinity in addition to NaN
  if (typeof value === "number" && !isFinite(value)) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'nan',
          path: [],
          message: 'Expected a finite number',
        },
      ]),
    };
  }
  return schema.safeParse(value);
}

export function createNumberSchema(
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  } = {}
): z.ZodNumber {
  let schema = z.number();

  if (options.min !== undefined) {
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

  if (options.max !== undefined) {
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
  input: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
  >
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  if (typeof input !== "number" || isNaN(input) || !isFinite(input)) {
    return {
      success: false,
      errors: [
        {
          code: 'invalid_type',
          expected: "number",
          received: typeof input,
          path: [],
          message: "Expected number, received " + typeof input,
        } as z.ZodIssue,
      ],
    };
  }

  const issues: z.ZodIssue[] = [];
  const data = input as number;

  for (const check of checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive ? data < check.value : data <= check.value;
      if (tooSmall) {
        issues.push({
          code: 'too_small',
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          path: [],
          message: check.message ?? `Number must be ${check.inclusive ? "greater than or equal to" : "greater than"} ${check.value}`,
        } as z.ZodIssue);
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive ? data > check.value : data >= check.value;
      if (tooBig) {
        issues.push({
          code: 'too_big',
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          path: [],
          message: check.message ?? `Number must be ${check.inclusive ? "less than or equal to" : "less than"} ${check.value}`,
        } as z.ZodIssue);
      }
    }
  }

  if (issues.length > 0) {
    return { success: false, errors: issues };
  }

  return { success: true, data };
}

export function isValidMinBound(value: number, minValue: number): boolean {
  if (typeof value !== "number" || !isFinite(value)) {
    return false;
  }
  return value >= minValue;
}

export function isValidMaxBound(value: number, maxValue: number): boolean {
  if (typeof value !== "number" || !isFinite(value)) {
    return false;
  }
  return value <= maxValue;
}

export function isValidRange(value: number, minValue: number, maxValue: number): boolean {
  if (typeof value !== "number" || !isFinite(value)) {
    return false;
  }
  return value >= minValue && value <= maxValue;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter(num => typeof num === "number" && isFinite(num) && num >= minimumThreshold);
}

export function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter(num => typeof num === "number" && isFinite(num) && num <= maxThreshold);
}

export function filterByScoreRange(scores: number[], minScore: number, maxScore: number): number[] {
  return scores.filter(score => typeof score === "number" && isFinite(score) && score >= minScore && score <= maxScore);
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
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