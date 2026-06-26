// bloom-deps: zod@^3

import { z } from "zod";

const originalParse = (z.ZodNumber.prototype as any)._parse;

(z.ZodNumber.prototype as any)._parse = function (input: any) {
  const result = originalParse.call(this, input);

  const processResult = (res: any) => {
    if (res && res.status === "aborted") {
      return res;
    }

    if (typeof res.data !== "number" || isNaN(res.data)) {
      return res;
    }

    if (!res.ctx) {
      return res;
    }

    const ctx = res.ctx;

    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive
          ? res.data < check.value
          : res.data <= check.value;
        if (tooSmall) {
          ctx.addIssue({
            code: "too_small",
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive
          ? res.data > check.value
          : res.data >= check.value;
        if (tooBig) {
          ctx.addIssue({
            code: "too_big",
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? undefined,
          });
        }
      }
    }

    return res;
  };

  if (result instanceof Promise) {
    return result.then(processResult);
  }

  return processResult(result);
};

class ServiceError extends Error {
  public readonly cause?: Error;

  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = "ServiceError";
    this.cause = options?.cause;
  }
}

export function createNumberSchema(): z.ZodNumber {
  return z.number();
}

export function validateNumberInRange(
  value: unknown,
  min: number,
  max: number,
  options?: { minInclusive?: boolean; maxInclusive?: boolean }
): { success: boolean; error?: string; value?: number } {
  try {
    if (value === null || value === undefined) {
      return {
        success: false,
        error: "Value cannot be null or undefined",
      };
    }

    const minInclusive = options?.minInclusive ?? true;
    const maxInclusive = options?.maxInclusive ?? true;

    let schema = z.number();

    if (minInclusive) {
      schema = schema.min(min);
    } else {
      schema = schema.gt(min);
    }

    if (maxInclusive) {
      schema = schema.max(max);
    } else {
      schema = schema.lt(max);
    }

    const result = schema.safeParse(value);

    if (!result.success) {
      const firstError = result.error.errors[0];
      return {
        success: false,
        error: firstError?.message ?? "Validation failed",
      };
    }

    return { success: true, value: result.data };
  } catch (error) {
    throw new ServiceError("validateNumberInRange failed", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export function parseZodNumber(
  schema: z.ZodNumber,
  value: unknown
): z.SafeParseReturnType<number, number> {
  try {
    if (value === null || value === undefined) {
      return schema.safeParse(value);
    }

    return schema.safeParse(value);
  } catch (error) {
    throw new ServiceError("parseZodNumber failed", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export { z };