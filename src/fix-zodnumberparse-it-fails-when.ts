// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

class ZodNumber extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const ctx = this._getOrReturnCtx(input);

    if (typeof input.data !== "number" || isNaN(input.data)) {
      z.addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    let hadError = false;

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const failed = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;
        if (failed) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "max") {
        const failed = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;
        if (failed) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      }
    }

    if (hadError) {
      return z.INVALID;
    }

    return { status: "valid", value: input.data };
  }
}

function createZodNumberWithChecks(): z.ZodNumber {
  return new ZodNumber({
    checks: [],
    typeName: z.ZodFirstPartyTypeKind.ZodNumber,
    coerce: false,
  });
}

export function parseNumber(
  value: unknown,
  options?: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  }
): number {
  try {
    let schema: z.ZodNumber = createZodNumberWithChecks();

    if (options?.min !== undefined) {
      const min = options.min;
      if (min.inclusive) {
        schema = schema.min(min.value, { message: min.message });
      } else {
        schema = schema.gt(min.value, { message: min.message });
      }
    }

    if (options?.max !== undefined) {
      const max = options.max;
      if (max.inclusive) {
        schema = schema.max(max.value, { message: max.message });
      } else {
        schema = schema.lt(max.value, { message: max.message });
      }
    }

    const result = schema.safeParse(value);

    if (!result.success) {
      throw new ServiceError("Number validation failed", {
        cause: result.error,
      });
    }

    return result.data;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError("parseNumber operation failed", { cause: error });
  }
}

export function buildNumericSchema(options: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
  int?: boolean;
  multipleOf?: number;
}): z.ZodNumber {
  try {
    let schema = createZodNumberWithChecks();

    if (options.int) {
      schema = schema.int();
    }

    if (options.min !== undefined) {
      const min = options.min;
      if (min.inclusive) {
        schema = schema.min(min.value, { message: min.message });
      } else {
        schema = schema.gt(min.value, { message: min.message });
      }
    }

    if (options.max !== undefined) {
      const max = options.max;
      if (max.inclusive) {
        schema = schema.max(max.value, { message: max.message });
      } else {
        schema = schema.lt(max.value, { message: max.message });
      }
    }

    if (options.multipleOf !== undefined) {
      schema = schema.multipleOf(options.multipleOf);
    }

    return schema;
  } catch (error) {
    throw new ServiceError("buildNumericSchema operation failed", {
      cause: error,
    });
  }
}

export function validateNumericRange(
  value: unknown,
  min: number,
  max: number
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  try {
    if (typeof value !== "number") {
      return {
        success: false,
        errors: [
          {
            code: ZodIssueCode.invalid_type,
            expected: z.ZodParsedType.number,
            received: typeof value as z.ZodParsedType,
            path: [],
            message: "Expected number",
          },
        ],
      };
    }

    const schema = buildNumericSchema({
      min: { value: min, inclusive: true },
      max: { value: max, inclusive: true },
    });

    const result = schema.safeParse(value);

    if (!result.success) {
      return { success: false, errors: result.error.issues };
    }

    return { success: true, data: result.data };
  } catch (error) {
    throw new ServiceError("validateNumericRange operation failed", {
      cause: error,
    });
  }
}

export function filterByMinimumScore(
  scores: number[],
  minimumThreshold: number
): number[] {
  try {
    if (!Array.isArray(scores)) {
      throw new ServiceError("scores must be an array", {
        cause: new TypeError("Invalid scores input"),
      });
    }

    if (typeof minimumThreshold !== "number") {
      throw new ServiceError("minimumThreshold must be a number", {
        cause: new TypeError("Invalid threshold input"),
      });
    }

    return scores.filter((num) => num >= minimumThreshold);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError("filterByMinimumScore operation failed", {
      cause: error,
    });
  }
}

export function paginateItems<T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; total: number; page: number; limit: number } {
  try {
    if (typeof page !== "number" || page < 1) {
      throw new ServiceError("page must be a positive number", {
        cause: new RangeError("Invalid page"),
      });
    }

    if (typeof limit !== "number" || limit < 1) {
      throw new ServiceError("limit must be a positive number", {
        cause: new RangeError("Invalid limit"),
      });
    }

    if (!Array.isArray(items)) {
      throw new ServiceError("items must be an array", {
        cause: new TypeError("Invalid items input"),
      });
    }

    const offset = (page - 1) * limit;
    const data = items.slice(offset, offset + limit);

    return { data, total: items.length, page, limit };
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError("paginateItems operation failed", { cause: error });
  }
}

export { ZodNumber, ServiceError };

export default {
  ZodNumber,
  ServiceError,
  parseNumber,
  buildNumericSchema,
  validateNumericRange,
  filterByMinimumScore,
  paginateItems,
};