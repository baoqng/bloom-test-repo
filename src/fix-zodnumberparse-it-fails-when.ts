```
import { z, ZodIssueCode } from "zod";

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = "ServiceError";
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

type MinCheck = {
  kind: "min";
  value: number;
  inclusive: boolean;
  message?: string;
};

type MaxCheck = {
  kind: "max";
  value: number;
  inclusive: boolean;
  message?: string;
};

type NumberCheck = MinCheck | MaxCheck;

interface ZodNumberDef {
  checks: NumberCheck[];
}

interface ParseInput {
  data: unknown;
}

interface ParseContext {
  addIssue: (issue: {
    code: string;
    type: string;
    minimum?: number;
    maximum?: number;
    inclusive: boolean;
    message: string;
  }) => void;
}

function parseZodNumber(
  def: ZodNumberDef,
  input: ParseInput,
  ctx: ParseContext
): void {
  if (typeof input.data !== "number" || isNaN(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      type: "number",
      inclusive: false,
      message: "Expected number, received " + typeof input.data,
    });
    return;
  }

  for (const check of def.checks) {
    if (check.kind === "min") {
      const failsMin = check.inclusive
        ? input.data < check.value
        : input.data <= check.value;

      if (failsMin) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
      }
    } else if (check.kind === "max") {
      const failsMax = check.inclusive
        ? input.data > check.value
        : input.data >= check.value;

      if (failsMax) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
      }
    }
  }
}

export function createRangeSchema(
  min?: { value: number | null; inclusive: boolean; message?: string },
  max?: { value: number | null; inclusive: boolean; message?: string }
): z.ZodNumber {
  let schema = z.number();

  if (min !== undefined && min.value !== null) {
    if (min.inclusive) {
      schema = min.message
        ? schema.min(min.value, { message: min.message })
        : schema.min(min.value);
    } else {
      schema = min.message
        ? schema.gt(min.value, { message: min.message })
        : schema.gt(min.value);
    }
  }

  if (max !== undefined && max.value !== null) {
    if (max.inclusive) {
      schema = max.message
        ? schema.max(max.value, { message: max.message })
        : schema.max(max.value);
    } else {
      schema = max.message
        ? schema.lt(max.value, { message: max.message })
        : schema.lt(max.value);
    }
  }

  return schema;
}

export function validateNumber(
  schema: z.ZodNumber,
  value: unknown
): { success: true; data: number } | { success: false; errors: string[] } {
  try {
    const result = schema.safeParse(value);
    if (result.success) {
      return { success: true, data: result.data };
    }
    const errors = result.error.issues.map((issue) => issue.message);
    return { success: false, errors };
  } catch (error) {
    throw new ServiceError("Failed to validate number", { cause: error as Error });
  }
}

export function validateNumberInRange(
  value: unknown,
  minValue?: number | null,
  maxValue?: number | null,
  options?: {
    minInclusive?: boolean;
    maxInclusive?: boolean;
    minMessage?: string;
    maxMessage?: string;
  }
): { success: true; data: number } | { success: false; errors: string[] } {
  try {
    const minInclusive = options?.minInclusive ?? true;
    const maxInclusive = options?.maxInclusive ?? true;

    const schema = createRangeSchema(
      minValue !== undefined && minValue !== null
        ? {
            value: minValue,
            inclusive: minInclusive,
            message: options?.minMessage,
          }
        : undefined,
      maxValue !== undefined && maxValue !== null
        ? {
            value: maxValue,
            inclusive: maxInclusive,
            message: options?.maxMessage,
          }
        : undefined
    );

    return validateNumber(schema, value);
  } catch (error) {
    throw new ServiceError("Failed to validate number in range", { cause: error as Error });
  }
}

export { parseZodNumber, type NumberCheck, type MinCheck, type MaxCheck, type ZodNumberDef };
```