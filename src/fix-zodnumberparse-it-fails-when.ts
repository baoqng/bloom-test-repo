// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

function parseNumber(input: unknown): number {
  if (typeof input !== "number") {
    throw new ServiceError("operation failed", { cause: new Error("Input is not a number") });
  }
  return input;
}

const ZodNumberFixed = z.ZodNumber;

const originalParse = ZodNumberFixed.prototype._parse;

ZodNumberFixed.prototype._parse = function (input: z.ParseInput): z.ParseReturnType<number> {
  const parsedType = this._getType(input);

  if (parsedType !== z.ZodParsedType.number) {
    const ctx = this._getOrReturnCtx(input);
    z.addIssueToContext(ctx, {
      code: z.ZodIssueCode.invalid_type,
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
          code: z.ZodIssueCode.invalid_type,
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
          code: z.ZodIssueCode.too_small,
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
          code: z.ZodIssueCode.too_big,
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
          code: z.ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message,
        });
        status.dirty();
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(input.data)) {
        ctx = this._getOrReturnCtx(input, ctx);
        z.addIssueToContext(ctx, {
          code: z.ZodIssueCode.not_finite,
          message: check.message,
        });
        status.dirty();
      }
    }
  }

  return { status: status.value, value: input.data };
};

export function createNumberSchema(options?: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
}): z.ZodNumber {
  let schema = z.number();

  if (options?.min !== undefined) {
    const minOpt = options.min;
    if (minOpt.inclusive) {
      schema = minOpt.message !== undefined
        ? schema.min(minOpt.value, minOpt.message)
        : schema.min(minOpt.value);
    } else {
      schema = minOpt.message !== undefined
        ? schema.gt(minOpt.value, minOpt.message)
        : schema.gt(minOpt.value);
    }
  }

  if (options?.max !== undefined) {
    const maxOpt = options.max;
    if (maxOpt.inclusive) {
      schema = maxOpt.message !== undefined
        ? schema.max(maxOpt.value, maxOpt.message)
        : schema.max(maxOpt.value);
    } else {
      schema = maxOpt.message !== undefined
        ? schema.lt(maxOpt.value, maxOpt.message)
        : schema.lt(maxOpt.value);
    }
  }

  return schema;
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
  } catch (error) {
    throw new ServiceError("operation failed", { cause: error });
  }
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  if (items === null || items === undefined) {
    return [];
  }
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function isValidPrice(price: number, minPrice: number, maxPrice: number): boolean {
  return price >= minPrice && price <= maxPrice;
}

export { ServiceError, z };