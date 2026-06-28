// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;

type ZodNumberCheck =
  | { kind: "min"; value: number; inclusive: boolean; message?: string }
  | { kind: "max"; value: number; inclusive: boolean; message?: string }
  | { kind: "int"; message?: string }
  | { kind: "multipleOf"; value: number; message?: string }
  | { kind: "finite"; message?: string };

interface ZodNumberDef extends z.ZodTypeDef {
  checks: ZodNumberCheck[];
  typeName: z.ZodFirstPartyTypeKind.ZodNumber;
  coerce: boolean;
}

export class ZodNumber extends z.ZodType<number, ZodNumberDef> {
  _parse(input: z.ParseInput): z.ParseReturnType<number> {
    if (this._def.coerce) {
      input = { ...input, data: Number(input.data) };
    }

    const ctx = this._getOrReturnCtx(input);

    if (typeof input.data !== "number" || Number.isNaN(input.data)) {
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
        const tooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (tooSmall) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
          hadError = true;
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (tooBig) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
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
            message: check.message,
          });
          hadError = true;
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          hadError = true;
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          z.addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message,
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

  static create(params?: { coerce?: boolean }): ZodNumber {
    return new ZodNumber({
      checks: [],
      typeName: z.ZodFirstPartyTypeKind.ZodNumber,
      coerce: params?.coerce ?? false,
    });
  }

  min(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumber {
    const inclusive = options?.inclusive ?? true;
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        { kind: "min", value, inclusive, message: options?.message },
      ],
    });
  }

  max(value: number, options?: { inclusive?: boolean; message?: string }): ZodNumber {
    const inclusive = options?.inclusive ?? true;
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        { kind: "max", value, inclusive, message: options?.message },
      ],
    });
  }

  gte(value: number, message?: string): ZodNumber {
    return this.min(value, { inclusive: true, message });
  }

  gt(value: number, message?: string): ZodNumber {
    return this.min(value, { inclusive: false, message });
  }

  lte(value: number, message?: string): ZodNumber {
    return this.max(value, { inclusive: true, message });
  }

  lt(value: number, message?: string): ZodNumber {
    return this.max(value, { inclusive: false, message });
  }

  int(message?: string): ZodNumber {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, { kind: "int", message }],
    });
  }

  multipleOf(value: number, message?: string): ZodNumber {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, { kind: "multipleOf", value, message }],
    });
  }

  finite(message?: string): ZodNumber {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, { kind: "finite", message }],
    });
  }
}

export function parseNumberWithChecks(
  value: unknown,
  checks: ZodNumberCheck[]
): { success: true; data: number } | { success: false; error: z.ZodError } {
  const schema = new ZodNumber({
    checks,
    typeName: z.ZodFirstPartyTypeKind.ZodNumber,
    coerce: false,
  });

  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

export function isNumberInRange(
  value: number,
  min: number,
  max: number,
  inclusive = true
): boolean {
  if (inclusive) {
    return value >= min && value <= max;
  }
  return value > min && value < max;
}

export function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  return scores.filter((num) => num >= minimumThreshold);
}

export function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  return numbers.filter((num) => num <= maxThreshold);
}

export function isValidPrice(price: number, minPrice: number, maxPrice: number): boolean {
  return price >= minPrice && price <= maxPrice;
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

export default ZodNumber;