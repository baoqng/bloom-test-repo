// bloom-deps: zod@^3

import { z } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

export function fixedZodNumberParse(
  schema: z.ZodNumber,
  input: unknown
): z.SafeParseReturnType<number, number> {
  try {
    return schema.safeParse(input);
  } catch (error) {
    throw new ServiceError("ZodNumber parse failed", { cause: error });
  }
}

export function createZodNumberSchema(options?: {
  min?: { value: number; inclusive: boolean };
  max?: { value: number; inclusive: boolean };
}): z.ZodNumber {
  let schema = z.number();

  if (options?.min !== undefined) {
    const min = options.min;
    if (min.inclusive) {
      schema = schema.min(min.value);
    } else {
      schema = schema.gt(min.value);
    }
  }

  if (options?.max !== undefined) {
    const max = options.max;
    if (max.inclusive) {
      schema = schema.max(max.value);
    } else {
      schema = schema.lt(max.value);
    }
  }

  return schema;
}

export function validateNumberWithChecks(
  value: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean }
    | { kind: "max"; value: number; inclusive: boolean }
  >
): { success: true; data: number } | { success: false; errors: string[] } {
  if (typeof value !== "number" || isNaN(value)) {
    return { success: false, errors: ["Expected a number"] };
  }

  const errors: string[] = [];

  for (const check of checks) {
    if (check.kind === "min") {
      const fails = check.inclusive
        ? value < check.value
        : value <= check.value;
      if (fails) {
        errors.push(
          check.inclusive
            ? `Number must be greater than or equal to ${check.value}`
            : `Number must be greater than ${check.value}`
        );
      }
    } else if (check.kind === "max") {
      const fails = check.inclusive
        ? value > check.value
        : value >= check.value;
      if (fails) {
        errors.push(
          check.inclusive
            ? `Number must be less than or equal to ${check.value}`
            : `Number must be less than ${check.value}`
        );
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: value };
}

export function parseZodNumber(
  input: unknown,
  checks: Array<
    | { kind: "min"; value: number; inclusive: boolean }
    | { kind: "max"; value: number; inclusive: boolean }
  >
): z.SafeParseReturnType<number, number> {
  try {
    let schema = z.number();

    for (const check of checks) {
      if (check.kind === "min") {
        if (check.inclusive) {
          schema = schema.min(check.value);
        } else {
          schema = schema.gt(check.value);
        }
      } else if (check.kind === "max") {
        if (check.inclusive) {
          schema = schema.max(check.value);
        } else {
          schema = schema.lt(check.value);
        }
      }
    }

    return schema.safeParse(input);
  } catch (error) {
    throw new ServiceError("parseZodNumber failed", { cause: error });
  }
}

export { ServiceError };