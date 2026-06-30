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

export function patchZodNumberParse() {
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

    const checks = this._def.checks as Array<{
      kind: string;
      value: number;
      inclusive: boolean;
      message?: string;
    }>;

    let hadError = false;

    for (const check of checks) {
      if (check.kind === "min") {
        const fails = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (fails) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "max") {
        const fails = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (fails) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.too_big,
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
            code: z.ZodIssueCode.invalid_type,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: (check as { message?: string }).message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "multipleOf") {
        const typedCheck = check as { kind: string; value: number; message?: string };
        if (input.data % typedCheck.value !== 0) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.not_multiple_of,
            multipleOf: typedCheck.value,
            message: typedCheck.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          z.addIssueToContext(ctx, {
            code: z.ZodIssueCode.not_finite,
            message: (check as { message?: string }).message ?? undefined,
          });
          hadError = true;
        }
      }
    }

    return hadError ? z.INVALID : z.OK(input.data);
  };
}

patchZodNumberParse();

export function validateNumberInRange(
  value: unknown,
  min: number,
  max: number,
  inclusive: boolean = true
): { success: true; data: number } | { success: false; error: ServiceError } {
  try {
    let schema: z.ZodNumber;

    if (inclusive) {
      schema = z.number().min(min).max(max);
    } else {
      schema = z.number().gt(min).lt(max);
    }

    const result = schema.safeParse(value);

    if (!result.success) {
      return {
        success: false,
        error: new ServiceError(`Validation failed: ${result.error.message}`, {
          cause: result.error,
        }),
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    throw new ServiceError("validateNumberInRange failed", { cause: error });
  }
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function isValidPrice(price: number, minPrice: number): boolean {
  return price >= minPrice;
}

export function isWithinBudget(price: number, maxPrice: number): boolean {
  return price <= maxPrice;
}

export function isAmountInRange(amount: number, minAmount: number, maxAmount: number): boolean {
  return amount >= minAmount && amount <= maxAmount;
}

export function isQuantityValid(currentQuantity: number, maxItems: number): boolean {
  return currentQuantity <= maxItems;
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export { ServiceError };