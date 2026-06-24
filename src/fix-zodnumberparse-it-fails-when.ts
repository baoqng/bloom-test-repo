```typescript
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

class ZodNumberFixed extends z.ZodNumber {
  _parse(input: z.input<z.ZodNumber>): z.ParseReturnType<number> {
    const result = super._parse(input as any);
    return result;
  }
}

function parseNumber(
  def: z.ZodNumberDef,
  input: { data: unknown; addIssue: (issue: z.IssueData) => void }
): { status: string; value?: number } {
  const data = input.data;
  
  if (data === null || data === undefined) {
    input.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number" as z.ZodParsedType,
      received: (data === null ? "null" : "undefined") as z.ZodParsedType,
    });
    return { status: "aborted" };
  }

  if (typeof data !== "number" || isNaN(data)) {
    input.addIssue({
      code: ZodIssueCode.invalid_type,
      expected: "number" as z.ZodParsedType,
      received: (typeof data === "number"
        ? "nan"
        : typeof data) as z.ZodParsedType,
    });
    return { status: "aborted" };
  }

  const value = data;

  for (const check of def.checks) {
    if (check.kind === "min") {
      const tooSmall = check.inclusive
        ? value < check.value
        : value <= check.value;
      if (tooSmall) {
        input.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
      }
    } else if (check.kind === "max") {
      const tooBig = check.inclusive
        ? value > check.value
        : value >= check.value;
      if (tooBig) {
        input.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(value)) {
        input.addIssue({
          code: ZodIssueCode.invalid_type,
          expected: "integer" as z.ZodParsedType,
          received: "float" as z.ZodParsedType,
          message: check.message,
        });
      }
    } else if (check.kind === "multipleOf") {
      if (value % check.value !== 0) {
        input.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message,
        });
      }
    } else if (check.kind === "finite") {
      if (!Number.isFinite(value)) {
        input.addIssue({
          code: ZodIssueCode.not_finite,
          message: check.message,
        });
      }
    }
  }

  return { status: "valid", value };
}

export function validateNumber(
  schema: z.ZodNumber,
  data: unknown
): { success: boolean; data?: number; errors?: z.ZodIssue[] } {
  try {
    if (data === null || data === undefined) {
      return { success: false, errors: [] };
    }
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, errors: result.error.issues };
  } catch (error) {
    throw new ServiceError("Number validation failed", { cause: error instanceof Error ? error : new Error(String(error)) });
  }
}

export function createNumberValidator(options: {
  min?: { value: number | null; inclusive: boolean; message?: string };
  max?: { value: number | null; inclusive: boolean; message?: string };
  int?: boolean;
  multipleOf?: number | null;
  finite?: boolean;
}): (data: unknown) => { success: boolean; data?: number; errors?: z.ZodIssue[] } {
  let schema = z.number();

  if (options.min !== undefined && options.min !== null) {
    const min = options.min;
    if (min.value !== null && typeof min.value === "number") {
      if (min.inclusive) {
        schema = schema.min(min.value, { message: min.message ?? "value out of range" });
      } else {
        schema = schema.gt(min.value, { message: min.message ?? "value out of range" });
      }
    }
  }

  if (options.max !== undefined && options.max !== null) {
    const max = options.max;
    if (max.value !== null && typeof max.value === "number") {
      if (max.inclusive) {
        schema = schema.max(max.value, { message: max.message ?? "value out of range" });
      } else {
        schema = schema.lt(max.value, { message: max.message ?? "value out of range" });
      }
    }
  }

  if (options.int === true) {
    schema = schema.int();
  }

  if (options.multipleOf !== undefined && options.multipleOf !== null && typeof options.multipleOf === "number") {
    schema = schema.multipleOf(options.multipleOf);
  }

  if (options.finite === true) {
    schema = schema.finite();
  }

  return (data: unknown) => {
    try {
      if (data === null || data === undefined) {
        return { success: false, errors: [] };
      }
      const result = schema.safeParse(data);
      if (result.success) {
        return { success: true, data: result.data };
      }
      return { success: false, errors: result.error.issues };
    } catch (error) {
      throw new ServiceError("Number validation failed", { cause: error instanceof Error ? error : new Error(String(error)) });
    }
  };
}

export function validateNumberWithChecks(
  data: unknown,
  checks: z.ZodNumberDef["checks"]
): { success: boolean; data?: number; issues: z.IssueData[] } {
  const issues: z.IssueData[] = [];

  const addIssue = (issue: z.IssueData) => {
    issues.push(issue);
  };

  try {
    if (data === null || data === undefined) {
      return { success: false, issues: [] };
    }

    const result = parseNumber({ checks, typeName: z.ZodFirstPartyTypeKind.ZodNumber }, { data, addIssue });

    if (issues.length > 0 || result.status === "aborted") {
      return { success: false, issues };
    }

    return { success: true, data: result.value, issues: [] };
  } catch (error) {
    throw new ServiceError("Number validation with checks failed", { cause: error instanceof Error ? error : new Error(String(error)) });
  }
}

export { parseNumber };
```