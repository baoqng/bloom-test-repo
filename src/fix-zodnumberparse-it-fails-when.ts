// bloom-deps: zod@^3

import { z } from "zod";

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

export function createNumericSchema(
  min?: { value: number; inclusive: boolean; message?: string },
  max?: { value: number; inclusive: boolean; message?: string }
): z.ZodNumber {
  let schema = z.number().finite();

  if (min !== undefined) {
    if (min.inclusive) {
      schema = min.message !== undefined ? schema.min(min.value, { message: min.message }) : schema.min(min.value);
    } else {
      schema = min.message !== undefined ? schema.gt(min.value, { message: min.message }) : schema.gt(min.value);
    }
  }

  if (max !== undefined) {
    if (max.inclusive) {
      schema = max.message !== undefined ? schema.max(max.value, { message: max.message }) : schema.max(max.value);
    } else {
      schema = max.message !== undefined ? schema.lt(max.value, { message: max.message }) : schema.lt(max.value);
    }
  }

  return schema;
}

export function parseNumber(
  value: unknown,
  options?: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  }
): number {
  const schema = createNumericSchema(options?.min, options?.max);
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new ServiceError("Number parsing failed", { cause: result.error });
  }

  return result.data;
}

export function validateNumericRange(
  input: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
  >
): { success: true; data: number } | { success: false; issues: z.ZodIssue[] } {
  if (typeof input !== "number" || isNaN(input) || !isFinite(input)) {
    return {
      success: false,
      issues: [
        {
          code: "invalid_type",
          expected: "number" as z.ZodParsedType,
          received: (typeof input === "number" ? (isNaN(input) ? "nan" : "infinity") : typeof input) as z.ZodParsedType,
          path: [],
          message: "Expected number",
        },
      ],
    };
  }

  const issues: z.ZodIssue[] = [];

  for (const check of checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive ? input < check.value : input <= check.value;
      if (tooSmall) {
        issues.push({
          code: "too_small",
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          path: [],
          message: check.message ?? (check.inclusive
            ? `Number must be greater than or equal to ${check.value}`
            : `Number must be greater than ${check.value}`),
        });
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive ? input > check.value : input >= check.value;
      if (tooBig) {
        issues.push({
          code: "too_big",
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          path: [],
          message: check.message ?? (check.inclusive
            ? `Number must be less than or equal to ${check.value}`
            : `Number must be less than ${check.value}`),
        });
      }
    }
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return { success: true, data: input };
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function filterByMaximumScore(scores: number[], maximumThreshold: number): number[] {
  return scores.filter((num) => num <= maximumThreshold);
}

export function filterByScoreRange(
  scores: number[],
  minScore: number,
  maxScore: number
): number[] {
  return scores.filter((num) => num >= minScore && num <= maxScore);
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
    (event) => event.createdAt >= startDate && event.createdAt <= endDate
  );
}

export function zodNumberParseChecks(
  inputData: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
  >
): z.SafeParseReturnType<number, number> {
  try {
    let schema = z.number().finite();

    for (const check of checks) {
      if (check.kind === "min") {
        if (check.inclusive) {
          schema = check.message !== undefined
            ? schema.min(check.value, { message: check.message })
            : schema.min(check.value);
        } else {
          schema = check.message !== undefined
            ? schema.gt(check.value, { message: check.message })
            : schema.gt(check.value);
        }
      } else if (check.kind === "max") {
        if (check.inclusive) {
          schema = check.message !== undefined
            ? schema.max(check.value, { message: check.message })
            : schema.max(check.value);
        } else {
          schema = check.message !== undefined
            ? schema.lt(check.value, { message: check.message })
            : schema.lt(check.value);
        }
      }
    }

    return schema.safeParse(inputData);
  } catch (error) {
    throw new ServiceError("zodNumberParseChecks failed", { cause: error });
  }
}