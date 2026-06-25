```
import { z, ZodIssueCode } from "zod";

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

type MultipleOfCheck = {
  kind: "multipleOf";
  value: number;
  message?: string;
};

type FiniteCheck = {
  kind: "finite";
  message?: string;
};

type IntCheck = {
  kind: "int";
  message?: string;
};

type NumberCheck =
  | MinCheck
  | MaxCheck
  | MultipleOfCheck
  | FiniteCheck
  | IntCheck;

interface ZodNumberDef {
  checks: NumberCheck[];
  typeName: string;
  coerce?: boolean;
}

interface ParseInput {
  data: unknown;
  path: (string | number)[];
  parent: ParseContext;
}

interface ParseContext {
  addIssue: (issue: {
    code: string;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
    message?: string;
    exact?: boolean;
    multipleOf?: number;
  }) => void;
}

interface ParseReturnType {
  status: "valid" | "dirty" | "aborted";
  value: unknown;
}

function isNumberCheck(check: NumberCheck): check is MinCheck | MaxCheck {
  return check.kind === "min" || check.kind === "max";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function parseNumber(
  input: ParseInput,
  def: ZodNumberDef
): ParseReturnType {
  const ctx = input.parent;

  if (!isNumber(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
      message: "Expected number, received " + typeof input.data,
    });
    return { status: "aborted", value: undefined };
  }

  let status: "valid" | "dirty" = "valid";

  for (const check of def.checks) {
    if (check.kind === "min") {
      if (check.inclusive ? input.data < check.value : input.data <= check.value) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: "number",
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        status = "dirty";
      }
    } else if (check.kind === "max") {
      if (check.inclusive ? input.data > check.value : input.data >= check.value) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: "number",
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? "value out of range",
        });
        status = "dirty";
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(input.data)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_type,
          message: check.message ?? "Expected integer",
        });
        status = "dirty";
      }
    } else if (check.kind === "multipleOf") {
      if (input.data % check.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          multipleOf: check.value,
          message: check.message ?? "Not a multiple of " + check.value,
        });
        status = "dirty";
      }
    } else if (check.kind === "finite") {
      if (!isFinite(input.data)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: check.message ?? "Number must be finite",
        });
        status = "dirty";
      }
    }
  }

  return { status, value: input.data };
}

export function createValidatedNumberSchema(
  min?: number,
  max?: number,
  options?: {
    minInclusive?: boolean;
    maxInclusive?: boolean;
    minMessage?: string;
    maxMessage?: string;
  }
): z.ZodNumber {
  let schema = z.number();

  if (min !== undefined) {
    const inclusive = options?.minInclusive !== false;
    if (inclusive) {
      schema = schema.min(min, options?.minMessage);
    } else {
      schema = schema.gt(min, options?.minMessage);
    }
  }

  if (max !== undefined) {
    const inclusive = options?.maxInclusive !== false;
    if (inclusive) {
      schema = schema.max(max, options?.maxMessage);
    } else {
      schema = schema.lt(max, options?.maxMessage);
    }
  }

  return schema;
}

export function validateNumberWithChecks(
  value: unknown,
  checks: NumberCheck[]
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!isNumber(value)) {
    return {
      valid: false,
      issues: ["Expected number, received " + typeof value],
    };
  }

  const num = value;

  for (const check of checks) {
    if (check.kind === "min") {
      if (check.inclusive ? num < check.value : num <= check.value) {
        issues.push(check.message ?? "value out of range");
      }
    } else if (check.kind === "max") {
      if (check.inclusive ? num > check.value : num >= check.value) {
        issues.push(check.message ?? "value out of range");
      }
    } else if (check.kind === "int") {
      if (!Number.isInteger(num)) {
        issues.push(check.message ?? "Expected integer");
      }
    } else if (check.kind === "multipleOf") {
      if (num % check.value !== 0) {
        issues.push(check.message ?? "Not a multiple of " + check.value);
      }
    } else if (check.kind === "finite") {
      if (!isFinite(num)) {
        issues.push(check.message ?? "Number must be finite");
      }
    }
  }

  return { valid: issues.length === 0, issues };
}

export function buildNumberChecks(params: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
  multipleOf?: { value: number; message?: string };
  int?: { message?: string };
  finite?: { message?: string };
}): NumberCheck[] {
  const checks: NumberCheck[] = [];

  if (params.min !== undefined) {
    checks.push({
      kind: "min",
      value: params.min.value,
      inclusive: params.min.inclusive,
      message: params.min.message,
    });
  }

  if (params.max !== undefined) {
    checks.push({
      kind: "max",
      value: params.max.value,
      inclusive: params.max.inclusive,
      message: params.max.message,
    });
  }

  if (params.multipleOf !== undefined) {
    checks.push({
      kind: "multipleOf",
      value: params.multipleOf.value,
      message: params.multipleOf.message,
    });
  }

  if (params.int !== undefined) {
    checks.push({
      kind: "int",
      message: params.int.message,
    });
  }

  if (params.finite !== undefined) {
    checks.push({
      kind: "