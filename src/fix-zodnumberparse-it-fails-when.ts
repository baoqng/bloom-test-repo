```
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
  coerce: boolean;
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
    message: string;
    exact?: boolean;
  }) => void;
}

const ParseInputSchema = z.object({
  data: z.unknown(),
});

const ZodNumberDefSchema = z.object({
  checks: z.array(z.unknown()),
  coerce: z.boolean(),
});

const MinCheckSchema = z.object({
  kind: z.literal("min"),
  value: z.number(),
  inclusive: z.boolean(),
  message: z.string().optional(),
});

const MaxCheckSchema = z.object({
  kind: z.literal("max"),
  value: z.number(),
  inclusive: z.boolean(),
  message: z.string().optional(),
});

const MultipleOfCheckSchema = z.object({
  kind: z.literal("multipleOf"),
  value: z.number(),
  message: z.string().optional(),
});

const FiniteCheckSchema = z.object({
  kind: z.literal("finite"),
  message: z.string().optional(),
});

const IntCheckSchema = z.object({
  kind: z.literal("int"),
  message: z.string().optional(),
});

const NumberCheckSchema = z.union([
  MinCheckSchema,
  MaxCheckSchema,
  MultipleOfCheckSchema,
  FiniteCheckSchema,
  IntCheckSchema,
]);

export function parseZodNumber(
  input: ParseInput,
  def: ZodNumberDef,
  ctx: ParseContext
): { status: "valid"; value: number } | { status: "invalid" } {
  try {
    const validatedInput = ParseInputSchema.safeParse(input);
    if (!validatedInput.success) {
      console.error("Invalid ParseInput:", validatedInput.error);
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        message: "Invalid input structure",
      });
      return { status: "invalid" };
    }

    const validatedDef = ZodNumberDefSchema.safeParse(def);
    if (!validatedDef.success) {
      console.error("Invalid ZodNumberDef:", validatedDef.error);
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        message: "Invalid definition structure",
      });
      return { status: "invalid" };
    }

    if (typeof validatedInput.data.data !== "number" || isNaN(validatedInput.data.data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        message: "Expected number, received " + typeof validatedInput.data.data,
      });
      return { status: "invalid" };
    }

    const value = validatedInput.data.data;
    let isValid = true;

    for (const check of validatedDef.data.checks) {
      const validatedCheck = NumberCheckSchema.safeParse(check);
      if (!validatedCheck.success) {
        console.error("Invalid NumberCheck:", validatedCheck.error);
        continue;
      }

      const checkedValue = validatedCheck.data;

      if (checkedValue.kind === "min") {
        if (checkedValue.inclusive ? value < checkedValue.value : value <= checkedValue.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: checkedValue.value,
            inclusive: checkedValue.inclusive,
            message: checkedValue.message ?? "value out of range",
          });
          isValid = false;
        }
      } else if (checkedValue.kind === "max") {
        if (checkedValue.inclusive ? value > checkedValue.value : value >= checkedValue.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: checkedValue.value,
            inclusive: checkedValue.inclusive,
            message: checkedValue.message ?? "value out of range",
          });
          isValid = false;
        }
      } else if (checkedValue.kind === "multipleOf") {
        if (value % checkedValue.value !== 0) {
          ctx.addIssue({
            code: ZodIssueCode.not_multiple_of,
            message: checkedValue.message ?? `Number must be a multiple of ${checkedValue.value}`,
          });
          isValid = false;
        }
      } else if (checkedValue.kind === "finite") {
        if (!isFinite(value)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: checkedValue.message ?? "Number must be finite",
          });
          isValid = false;
        }
      } else if (checkedValue.kind === "int") {
        if (!Number.isInteger(value)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            message: checkedValue.message ?? "Expected integer, received float",
          });
          isValid = false;
        }
      }
    }

    if (!isValid) {
      return { status: "invalid" };
    }

    return { status: "valid", value };
  } catch (error) {
    console.error("Error in parseZodNumber:", error);
    throw new Error(
      `parseZodNumber failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export function createValidatedNumberSchema(
  min?: { value: number; inclusive: boolean; message?: string },
  max?: { value: number; inclusive: boolean; message?: string }
): z.ZodNumber {
  try {
    let schema = z.number();

    if (min !== undefined && typeof min === "object" && min !== null && "value" in min && "inclusive" in min) {
      const minValue = min.value;
      const minInclusive = min.inclusive;
      const minMessage = min.message;

      if (minInclusive) {
        schema = minMessage !== undefined ? schema.min(minValue, minMessage) : schema.min(minValue);
      } else {
        schema = minMessage !== undefined ? schema.gt(minValue, minMessage) : schema.gt(minValue);
      }
    }

    if (max !== undefined && typeof max === "object" && max !== null && "value" in max && "inclusive" in max) {
      const maxValue = max.value;
      const maxInclusive = max.inclusive;
      const maxMessage = max.message;

      if (maxInclusive) {
        schema = maxMessage !== undefined ? schema.max(maxValue, maxMessage) : schema.max(maxValue);
      } else {
        schema = maxMessage !== undefined ? schema.lt(maxValue, maxMessage) : schema.lt(maxValue);
      }
    }

    return schema;
  } catch (error) {
    console.error("Error in createValidatedNumberSchema