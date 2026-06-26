// bloom-deps: zod@^3

import { z, ZodIssueCode } from 'zod';

type MinCheck = {
  kind: 'min';
  value: number;
  inclusive: boolean;
  message?: string;
};

type MaxCheck = {
  kind: 'max';
  value: number;
  inclusive: boolean;
  message?: string;
};

type MultipleOfCheck = {
  kind: 'multipleOf';
  value: number;
  message?: string;
};

type FiniteCheck = {
  kind: 'finite';
  message?: string;
};

type IntCheck = {
  kind: 'int';
  message?: string;
};

type NumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

interface ZodNumberDef {
  checks: NumberCheck[];
  coerce: boolean;
}

export function parseZodNumber(
  def: ZodNumberDef,
  input: { data: unknown },
  ctx: {
    addIssue: (issue: {
      code: string;
      type?: string;
      minimum?: number;
      maximum?: number;
      inclusive?: boolean;
      message?: string;
      exact?: boolean;
    }) => void;
  }
): { status: 'valid'; value: number } | { status: 'dirty'; value: number } | { status: 'aborted' } {
  if (typeof input.data !== 'number' || isNaN(input.data)) {
    ctx.addIssue({
      code: ZodIssueCode.invalid_type,
    });
    return { status: 'aborted' };
  }

  const value = input.data as number;

  for (const check of def.checks) {
    if (check.kind === 'min') {
      const failed = check.inclusive ? value < check.value : value <= check.value;
      if (failed) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          type: 'number',
          minimum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
      }
    } else if (check.kind === 'max') {
      const failed = check.inclusive ? value > check.value : value >= check.value;
      if (failed) {
        ctx.addIssue({
          code: ZodIssueCode.too_big,
          type: 'number',
          maximum: check.value,
          inclusive: check.inclusive,
          message: check.message ?? undefined,
        });
      }
    } else if (check.kind === 'multipleOf') {
      if (value % check.value !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.not_multiple_of,
          message: check.message ?? undefined,
        });
      }
    } else if (check.kind === 'finite') {
      if (!isFinite(value)) {
        ctx.addIssue({
          code: ZodIssueCode.not_finite,
          message: check.message ?? undefined,
        });
      }
    } else if (check.kind === 'int') {
      if (!Number.isInteger(value)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_type,
          message: check.message ?? undefined,
        });
      }
    }
  }

  return { status: 'valid', value };
}

export function createValidatedNumberSchema(
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
    multipleOf?: { value: number; message?: string };
    int?: { message?: string };
    finite?: { message?: string };
  } = {}
): z.ZodNumber {
  let schema = z.number();

  if (options.min !== undefined) {
    const min = options.min;
    if (min.inclusive) {
      schema = min.message !== undefined ? schema.min(min.value, { message: min.message }) : schema.min(min.value);
    } else {
      schema = min.message !== undefined ? schema.gt(min.value, { message: min.message }) : schema.gt(min.value);
    }
  }

  if (options.max !== undefined) {
    const max = options.max;
    if (max.inclusive) {
      schema = max.message !== undefined ? schema.max(max.value, { message: max.message }) : schema.max(max.value);
    } else {
      schema = max.message !== undefined ? schema.lt(max.value, { message: max.message }) : schema.lt(max.value);
    }
  }

  if (options.multipleOf !== undefined) {
    const mo = options.multipleOf;
    schema = mo.message !== undefined ? schema.multipleOf(mo.value, { message: mo.message }) : schema.multipleOf(mo.value);
  }

  if (options.int !== undefined) {
    const intOpt = options.int;
    schema = intOpt.message !== undefined ? schema.int(intOpt.message) : schema.int();
  }

  if (options.finite !== undefined) {
    const finiteOpt = options.finite;
    schema = finiteOpt.message !== undefined ? schema.finite(finiteOpt.message) : schema.finite();
  }

  return schema;
}

export function validateNumberInRange(
  value: unknown,
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
  }
): { success: true; data: number } | { success: false; errors: string[] } {
  const schema = createValidatedNumberSchema(options);
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => issue.message);
  return { success: false, errors };
}