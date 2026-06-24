```typescript
import { z, ZodIssueCode } from "zod";

interface MinCheck {
  kind: "min";
  value: number;
  inclusive: boolean;
  message?: string;
}

interface MaxCheck {
  kind: "max";
  value: number;
  inclusive: boolean;
  message?: string;
}

interface MultipleOfCheck {
  kind: "multipleOf";
  value: number;
  message?: string;
}

interface FiniteCheck {
  kind: "finite";
  message?: string;
}

interface IntCheck {
  kind: "int";
  message?: string;
}

type NumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

interface ZodNumberDef {
  checks: NumberCheck[];
  coerce?: boolean;
}

interface ParseInput {
  data: unknown;
}

interface ParseContext {
  addIssue: (issue: {
    code: string;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    message?: string;
    input?: unknown;
  }) => void;
}

interface ParseResult {
  status: "valid" | "dirty" | "aborted";
  value?: number;
}

class ServiceError extends Error {
  cause?: Error;
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = "ServiceError";
    this.cause = options?.cause;
  }
}

export function parseZodNumber(
  input: ParseInput,
  ctx: ParseContext,
  def: ZodNumberDef
): ParseResult {
  try {
    if (typeof input.data !== "number" || isNaN(input.data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        message: "Expected number, received " + typeof input.data,
      });
      return { status: "aborted" };
    }

    const data = input.data;
    let isDirty = false;

    for (const check of def.checks) {
      if (check.kind === "min") {
        if (check.inclusive ? data < check.value : data <= check.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? "value out of range",
          });
          isDirty = true;
        }
      } else if (check.kind === "max") {
        if (check.inclusive ? data > check.value : data >= check.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? "value out of range",
          });
          isDirty = true;
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(data)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            message: check.message ?? "Expected integer",
          });
          isDirty = true;
        }
      } else if (check.kind === "multipleOf") {
        if (typeof check.value === "number" && check.value !== null) {
          const remainder = data % check.value;
          if (remainder !== 0) {
            ctx.addIssue({
              code: ZodIssueCode.not_multiple_of,
              message: check.message ?? `Number must be a multiple of ${check.value}`,
            });
            isDirty = true;
          }
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(data)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: check.message ?? "Number must be finite",
          });
          isDirty = true;
        }
      }
    }

    if (isDirty) {
      return { status: "dirty", value: data };
    }

    return { status: "valid", value: data };
  } catch (error) {
    throw new ServiceError("parseZodNumber failed", { cause: error as Error });
  }
}

export function createNumberSchema(def: ZodNumberDef): z.ZodEffects<z.ZodNumber, number, number> {
  try {
    let schema = z.number();

    for (const check of def.checks) {
      if (check.kind === "min") {
        if (check.inclusive) {
          schema = schema.min(check.value, { message: check.message }) as z.ZodNumber;
        } else {
          schema = schema.gt(check.value, { message: check.message }) as z.ZodNumber;
        }
      } else if (check.kind === "max") {
        if (check.inclusive) {
          schema = schema.max(check.value, { message: check.message }) as z.ZodNumber;
        } else {
          schema = schema.lt(check.value, { message: check.message }) as z.ZodNumber;
        }
      } else if (check.kind === "int") {
        schema = schema.int({ message: check.message }) as z.ZodNumber;
      } else if (check.kind === "multipleOf") {
        if (typeof check.value === "number" && check.value !== null) {
          schema = schema.multipleOf(check.value, { message: check.message }) as z.ZodNumber;
        }
      } else if (check.kind === "finite") {
        schema = schema.finite({ message: check.message }) as z.ZodNumber;
      }
    }

    return schema.transform((val) => val);
  } catch (error) {
    throw new ServiceError("createNumberSchema failed", { cause: error as Error });
  }
}

export function validateNumber(
  value: unknown,
  def: ZodNumberDef
): { success: true; data: number } | { success: false; errors: string[] } {
  try {
    if (value === undefined || value === null) {
      return { success: false, errors: ["Value must not be null or undefined"] };
    }

    if (typeof value !== "number") {
      return { success: false, errors: [`Expected number, received ${typeof value}`] };
    }

    if (isNaN(value)) {
      return { success: false, errors: ["Value must not be NaN"] };
    }

    const errors: string[] = [];

    for (const check of def.checks) {
      if (check.kind === "min") {
        if (check.inclusive ? value < check.value : value <= check.value) {
          errors.push(check.message ?? "value out of range");
        }
      } else if (check.kind === "max") {
        if (check.inclusive ? value > check.value : value >= check.value) {
          errors.push(check.message ?? "value out of range");
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(value)) {
          errors.push(check.message ?? "Expected integer");
        }
      } else if (check.kind === "multipleOf") {
        if (typeof check.value === "number" && check.value !== null && value % check.value !== 0) {
          errors.push(check.message ?? `Number must be a multiple of ${check.value}`);
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(value)) {
          errors.push(check.message ?? "Number must be finite");
        }
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: value };
  } catch (error) {
    throw new ServiceError("validateNumber failed