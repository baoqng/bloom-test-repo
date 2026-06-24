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
    multipleOf?: number;
  }) => void;
}

// Type guard to validate if a check is MinCheck
function isMinCheck(check: NumberCheck): check is MinCheck {
  return check.kind === "min" && typeof check.value === "number" && typeof check.inclusive === "boolean";
}

// Type guard to validate if a check is MaxCheck
function isMaxCheck(check: NumberCheck): check is MaxCheck {
  return check.kind === "max" && typeof check.value === "number" && typeof check.inclusive === "boolean";
}

// Type guard to validate if a check is MultipleOfCheck
function isMultipleOfCheck(check: NumberCheck): check is MultipleOfCheck {
  return check.kind === "multipleOf" && typeof check.value === "number";
}

// Type guard to validate if a check is FiniteCheck
function isFiniteCheck(check: NumberCheck): check is FiniteCheck {
  return check.kind === "finite";
}

// Type guard to validate if a check is IntCheck
function isIntCheck(check: NumberCheck): check is IntCheck {
  return check.kind === "int";
}

// Type guard to validate if input data is a number
function isValidNumber(data: unknown): data is number {
  return typeof data === "number" && !isNaN(data);
}

export function parseZodNumber(
  input: ParseInput,
  ctx: ParseContext,
  def: ZodNumberDef
): { success: boolean; value?: number } {
  try {
    if (!isValidNumber(input.data)) {
      ctx.addIssue({
        code: ZodIssueCode.invalid_type,
        message: "Expected number, received " + typeof input.data,
      });
      return { success: false };
    }

    const value = input.data;

    if (!Array.isArray(def.checks)) {
      console.error("def.checks is not an array");
      return { success: false };
    }

    for (const check of def.checks) {
      if (check == null) {
        console.error("check is null or undefined");
        continue;
      }

      if (isMinCheck(check)) {
        if (check.inclusive ? value < check.value : value <= check.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? "value out of range",
          });
        }
      } else if (isMaxCheck(check)) {
        if (check.inclusive ? value > check.value : value >= check.value) {
          ctx.addIssue({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message ?? "value out of range",
          });
        }
      } else if (isMultipleOfCheck(check)) {
        if (value % check.value !== 0) {
          ctx.addIssue({
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
        }
      } else if (isFiniteCheck(check)) {
        if (!isFinite(value)) {
          ctx.addIssue({
            code: ZodIssueCode.not_finite,
            message: check.message,
          });
        }
      } else if (isIntCheck(check)) {
        if (!Number.isInteger(value)) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_type,
            message: check.message ?? "Expected integer",
          });
        }
      }
    }

    return { success: true, value };
  } catch (error) {
    console.error("Error in parseZodNumber:", error);
    throw new Error(
      `parseZodNumber failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export function createNumberValidator(def: ZodNumberDef) {
  return {
    parse(input: ParseInput): { success: boolean; value?: number; issues: ReturnType<typeof collectIssues> } {
      const issues: Array<{
        code: string;
        type?: string;
        minimum?: number;
        maximum?: number;
        inclusive?: boolean;
        message?: string;
        multipleOf?: number;
      }> = [];

      const ctx: ParseContext = {
        addIssue(issue) {
          issues.push(issue);
        },
      };

      const result = parseZodNumber(input, ctx, def);

      return {
        success: result.success && issues.length === 0,
        value: result.value,
        issues,
      };
    },
  };
}

function collectIssues() {
  return [] as Array<{
    code: string;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    message?: string;
    multipleOf?: number;
  }>;
}

export function buildNumberSchema(checks: NumberCheck[]): ReturnType<typeof createNumberValidator> {
  try {
    if (!Array.isArray(checks)) {
      console.error("checks is not an array");
      throw new Error("checks must be an array");
    }

    if (checks.some(check => check == null)) {
      console.error("checks contains null or undefined values");
      throw new Error("checks contains invalid values");
    }

    const def: ZodNumberDef = { checks };
    return createNumberValidator(def);
  } catch (error) {
    console.error("Error in buildNumberSchema:", error);
    throw new Error(
      `buildNumberSchema failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export function validateNumberRange(
  value: unknown,
  min: number,
  max: number,
  options?: { minInclusive?: boolean; maxInclusive?: boolean }
): { valid: boolean; errors: string[] } {
  try {
    if (value == null) {
      console.error("value is null or undefined");
      return { valid: false, errors: ["Value is null or undefined"] };
    }

    if (typeof min !== "number" || typeof max !== "number") {
      console.error("min or max is not a number");
      return { valid: false, errors: ["Invalid min or max value"] };
    }

    const minInclusive = options?.minInclusive ?? true;
    const maxInclusive = options?.maxInclusive ?? true;

    const checks: NumberCheck[] = [
      { kind: "min", value: min, inclusive: minInclusive },
      { kind: "max", value: max, inclusive: maxInclusive },
    ];

    const validator = buildNumberSchema(checks);
    const result = validator.parse({ data: value });

    const