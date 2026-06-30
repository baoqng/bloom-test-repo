// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

export function createZodNumber() {
  return z.number();
}

export function patchZodNumberParse(): void {
  const ZodNumber = z.ZodNumber;
  const originalParse = ZodNumber.prototype._parse;

  ZodNumber.prototype._parse = function (input: z.ParseInput): z.ParseReturnType<number> {
    const ctx = this._getOrReturnCtx(input);

    if (typeof input.data !== "number" || Number.isNaN(input.data)) {
      z.addIssueToContext(ctx, {
        code: z.ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    const checks = (this._def as z.ZodNumberDef).checks;

    for (const check of checks) {
      if (check.kind === "min") {
        const fails = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (fails) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "max") {
        const fails = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (fails) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "multipleOf") {
        const remainder = input.data % check.value;
        if (remainder !== 0) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.not_finite,
            message: check.message ?? undefined,
          });
        }
      }
    }

    if (ctx.common.issues.length > 0) {
      return z.INVALID;
    }

    return { status: "valid", value: input.data };
  };
}

export function validateNumberRange(
  value: unknown,
  options: { min?: number; max?: number; inclusive?: boolean } = {}
): { success: true; value: number } | { success: false; errors: string[] } {
  try {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return { success: false, errors: ["Expected a number"] };
    }

    const errors: string[] = [];
    const inclusive = options.inclusive ?? true;

    if (options.min !== undefined && options.min !== null) {
      const fails = inclusive ? value < options.min : value <= options.min;
      if (fails) {
        errors.push(
          inclusive
            ? `Value must be >= ${options.min}`
            : `Value must be > ${options.min}`
        );
      }
    }

    if (options.max !== undefined && options.max !== null) {
      const fails = inclusive ? value > options.max : value >= options.max;
      if (fails) {
        errors.push(
          inclusive
            ? `Value must be <= ${options.max}`
            : `Value must be < ${options.max}`
        );
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, value };
  } catch (error) {
    throw new ServiceError("validateNumberRange failed", { cause: error });
  }
}

export function buildNumberSchema(options: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
  int?: boolean;
  multipleOf?: number;
}): z.ZodNumber {
  try {
    let schema = z.number();

    if (options.min !== undefined && options.min !== null) {
      if (options.min.inclusive) {
        schema = schema.min(options.min.value, { message: options.min.message });
      } else {
        schema = schema.gt(options.min.value, { message: options.min.message });
      }
    }

    if (options.max !== undefined && options.max !== null) {
      if (options.max.inclusive) {
        schema = schema.max(options.max.value, { message: options.max.message });
      } else {
        schema = schema.lt(options.max.value, { message: options.max.message });
      }
    }

    if (options.int === true) {
      schema = schema.int();
    }

    if (options.multipleOf !== undefined && options.multipleOf !== null) {
      schema = schema.multipleOf(options.multipleOf);
    }

    return schema;
  } catch (error) {
    throw new ServiceError("buildNumberSchema failed", { cause: error });
  }
}

export function parseWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    const errors = result.error.errors.map((e) => e.message);
    return { success: false, errors };
  } catch (error) {
    throw new ServiceError("parseWithSchema failed", { cause: error });
  }
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function isValidPrice(price: number, minPrice: number): boolean {
  return price >= minPrice;
}

export function isPriceWithinBudget(price: number, maxPrice: number): boolean {
  return price <= maxPrice;
}

export function isAmountValid(amount: number, minAmount: number, maxAmount: number): boolean {
  return amount >= minAmount && amount <= maxAmount;
}

export function isQuantityAllowed(currentQuantity: number, maxItems: number): boolean {
  return currentQuantity <= maxItems;
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  try {
    if (items === null || items === undefined) {
      return [];
    }
    const offset = (page - 1) * limit;
    return items.slice(offset, offset + limit);
  } catch (error) {
    throw new ServiceError("paginateItems failed", { cause: error });
  }
}

patchZodNumberParse();

export { ServiceError };