// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
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
  typeName: "ZodNumber";
  coerce: boolean;
}

interface ParseInput {
  data: unknown;
}

interface ParseContext {
  addIssue: (issue: z.ZodIssueOptionalMessage) => void;
}

type ParseReturnType<T> =
  | { status: "valid"; value: T }
  | { status: "dirty"; value: T }
  | { status: "aborted" };

function isParseAborted(result: ParseReturnType<unknown>): result is { status: "aborted" } {
  return result.status === "aborted";
}

export function parseZodNumber(
  input: ParseInput,
  def: ZodNumberDef
): { issues: z.ZodIssueOptionalMessage[] } {
  try {
    const issues: z.ZodIssueOptionalMessage[] = [];

    const addIssue = (issue: z.ZodIssueOptionalMessage): void => {
      issues.push(issue);
    };

    if (typeof input.data !== "number" || Number.isNaN(input.data)) {
      addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: Number.isNaN(input.data) ? z.ZodParsedType.nan : z.ZodParsedType.unknown,
        message: "Expected number, received " + typeof input.data,
      });
      return { issues };
    }

    const value = input.data as number;

    if (!Array.isArray(def.checks)) {
      return { issues };
    }

    for (const check of def.checks) {
      if (check == null) {
        continue;
      }

      if (check.kind === "min") {
        const minCheck = check as { kind: "min"; value: number; inclusive: boolean; message?: string };
        if (minCheck.value == null) {
          continue;
        }
        const tooSmall = minCheck.inclusive ? value < minCheck.value : value <= minCheck.value;
        if (tooSmall) {
          addIssue({
            code: z.ZodIssueCode.too_small,
            type: "number",
            minimum: minCheck.value,
            inclusive: minCheck.inclusive,
            message: minCheck.message ?? undefined,
          });
        }
      } else if (check.kind === "max") {
        const maxCheck = check as { kind: "max"; value: number; inclusive: boolean; message?: string };
        if (maxCheck.value == null) {
          continue;
        }
        const tooBig = maxCheck.inclusive ? value > maxCheck.value : value >= maxCheck.value;
        if (tooBig) {
          addIssue({
            code: z.ZodIssueCode.too_big,
            type: "number",
            maximum: maxCheck.value,
            inclusive: maxCheck.inclusive,
            message: maxCheck.message ?? undefined,
          });
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(value)) {
          addIssue({
            code: z.ZodIssueCode.invalid_type,
            expected: z.ZodParsedType.integer,
            received: z.ZodParsedType.float,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "multipleOf") {
        const multipleCheck = check as { kind: "multipleOf"; value: number; message?: string };
        if (multipleCheck.value == null) {
          continue;
        }
        if (value % multipleCheck.value !== 0) {
          addIssue({
            code: z.ZodIssueCode.not_multiple_of,
            multipleOf: multipleCheck.value,
            message: multipleCheck.message ?? undefined,
          });
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(value)) {
          addIssue({
            code: z.ZodIssueCode.not_finite,
            message: check.message ?? undefined,
          });
        }
      }
    }

    return { issues };
  } catch (error) {
    throw new ServiceError("parseZodNumber operation failed", { cause: error });
  }
}

export function validateNumberWithSchema(
  schema: z.ZodNumber,
  value: unknown
): { success: true; data: number } | { success: false; error: z.ZodError } {
  try {
    const result = schema.safeParse(value);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  } catch (error) {
    throw new ServiceError("validateNumberWithSchema operation failed", { cause: error });
  }
}

export function createCheckedNumberSchema(options: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
}): z.ZodNumber {
  try {
    if (options == null) {
      return z.number();
    }

    let schema = z.number();

    if (options.min != null) {
      const min = options.min;
      if (min.value == null) {
        throw new ServiceError("min.value is required");
      }
      if (min.inclusive) {
        schema = min.message != null ? schema.min(min.value, { message: min.message }) : schema.min(min.value);
      } else {
        schema = min.message != null ? schema.gt(min.value, { message: min.message }) : schema.gt(min.value);
      }
    }

    if (options.max != null) {
      const max = options.max;
      if (max.value == null) {
        throw new ServiceError("max.value is required");
      }
      if (max.inclusive) {
        schema = max.message != null ? schema.max(max.value, { message: max.message }) : schema.max(max.value);
      } else {
        schema = max.message != null ? schema.lt(max.value, { message: max.message }) : schema.lt(max.value);
      }
    }

    return schema;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError("createCheckedNumberSchema operation failed", { cause: error });
  }
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  if (!Array.isArray(scores)) {
    return [];
  }
  if (minimumThreshold == null) {
    return scores;
  }
  return scores.filter((num) => num >= minimumThreshold);
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  try {
    if (!Array.isArray(items)) {
      return [];
    }
    if (page == null || page < 1) {
      throw new ServiceError("page must be >= 1");
    }
    if (limit == null || limit < 1) {
      throw new ServiceError("limit must be >= 1");
    }
    const offset = (page - 1) * limit;
    return items.slice(offset, offset + limit);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError("paginateItems operation failed", { cause: error });
  }
}

export { ServiceError };