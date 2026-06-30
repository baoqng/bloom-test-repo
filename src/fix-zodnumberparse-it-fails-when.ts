// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

function parseNumber(input: unknown): number {
  if (typeof input !== "number") {
    throw new ServiceError("operation failed", { cause: new Error("Not a number") });
  }
  return input;
}

class ZodNumberFixed extends z.ZodNumber {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    const parsedType = this._getType(input);

    if (parsedType !== z.ZodParsedType.number) {
      const ctx = this._getOrReturnCtx(input);
      z.addIssueToContext(ctx, {
        code: "invalid_type" as const,
        expected: z.ZodParsedType.number,
        received: ctx.parsedType,
      });
      return z.INVALID;
    }

    let ctx: z.RefinementCtx | undefined = undefined;
    const status = new z.ParseStatus();

    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: "invalid_type" as const,
            expected: "integer" as z.ZodParsedType,
            received: "float" as z.ZodParsedType,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: "too_small" as const,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: "too_big" as const,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: "not_multiple_of" as const,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          z.addIssueToContext(ctx, {
            code: "not_finite" as const,
            message: check.message,
          });
          status.dirty();
        }
      }
    }

    return { status: status.value, value: input.data };
  }

  static create(params?: z.RawCreateParams): ZodNumberFixed {
    return new ZodNumberFixed({
      checks: [],
      typeName: z.ZodFirstPartyTypeKind.ZodNumber,
      coerce: (params as { coerce?: boolean })?.coerce ?? false,
      ...(params || {}),
    });
  }
}

export { ZodNumberFixed, ServiceError };

export function createFixedZodNumber(params?: z.RawCreateParams): ZodNumberFixed {
  return ZodNumberFixed.create(params);
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
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

export function isValidTotal(total: number, minTotal: number, maxTotal: number): boolean {
  return total >= minTotal && total <= maxTotal;
}

export function isValidQuantity(quantity: number, minQuantity: number, maxQuantity: number): boolean {
  return quantity >= minQuantity && quantity <= maxQuantity;
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}