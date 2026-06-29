// bloom-deps: zod@^3

import { z } from "zod";

const ZodIssueCode = z.ZodIssueCode;

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = "ServiceError";
  }
}

type MinCheck = { kind: "min"; value: number; inclusive: boolean; message?: string };
type MaxCheck = { kind: "max"; value: number; inclusive: boolean; message?: string };
type MultipleOfCheck = { kind: "multipleOf"; value: number; message?: string };
type FiniteCheck = { kind: "finite"; message?: string };
type IntCheck = { kind: "int"; message?: string };

type ZodNumberCheck = MinCheck | MaxCheck | MultipleOfCheck | FiniteCheck | IntCheck;

interface ZodNumberDef extends z.ZodTypeDef {
  checks: ZodNumberCheck[];
  typeName: z.ZodFirstPartyTypeKind.ZodNumber;
  coerce: boolean;
}

function parseZodNumber(
  def: ZodNumberDef,
  input: z.ParseInput,
  ctx: z.ParseContext
): z.ParseReturnType<number> {
  try {
    if (def.coerce) {
      input.data = Number(input.data);
    }

    if (typeof input.data !== "number" || Number.isNaN(input.data)) {
      const issue: z.ZodIssue = {
        code: ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.number,
        received: ctx.common.issues ? z.getParsedType(input.data) : z.getParsedType(input.data),
        path: [...ctx.path],
        message: `Expected number, received ${z.getParsedType(input.data)}`,
      };
      ctx.common.issues.push(issue);
      return z.INVALID;
    }

    for (const check of def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;

        if (tooSmall) {
          ctx.common.issues.push({
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message ?? undefined,
            path: [...ctx.path],
          } as z.ZodTooSmallIssue);
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;

        if (tooBig) {
          ctx.common.issues.push({
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message ?? undefined,
            path: [...ctx.path],
          } as z.ZodTooBigIssue);
        }
      } else if (check.kind === "int") {
        if (!Number.isInteger(input.data)) {
          ctx.common.issues.push({
            code: ZodIssueCode.invalid_type,
            expected: z.ZodParsedType.integer,
            received: z.ZodParsedType.float,
            message: check.message ?? undefined,
            path: [...ctx.path],
          } as z.ZodInvalidTypeIssue);
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== 0) {
          ctx.common.issues.push({
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message ?? undefined,
            path: [...ctx.path],
          } as z.ZodNotMultipleOfIssue);
        }
      } else if (check.kind === "finite") {
        if (!isFinite(input.data)) {
          ctx.common.issues.push({
            code: ZodIssueCode.not_finite,
            message: check.message ?? undefined,
            path: [...ctx.path],
          } as z.ZodNotFiniteIssue);
        }
      }
    }

    return ctx.common.issues.length > 0 ? z.INVALID : z.OK(input.data);
  } catch (error) {
    throw new ServiceError("parseZodNumber failed", { cause: error });
  }
}

function createZodNumberWithFixedParse(): z.ZodNumber {
  const schema = z.number();

  const originalParse = (schema as unknown as { _parse: (input: z.ParseInput) => z.ParseReturnType<number> })._parse.bind(schema);

  (schema as unknown as { _parse: (input: z.ParseInput) => z.ParseReturnType<number> })._parse = function (
    input: z.ParseInput
  ): z.ParseReturnType<number> {
    try {
      const def = (schema as unknown as { _def: ZodNumberDef })._def;
      const ctx = this._getOrReturnCtx(input);
      return parseZodNumber(def, input, ctx);
    } catch (error) {
      throw new ServiceError("_parse failed", { cause: error });
    }
  };

  return schema;
}

export function buildNumberSchema(options: {
  min?: { value: number; inclusive: boolean; message?: string };
  max?: { value: number; inclusive: boolean; message?: string };
  int?: boolean;
  multipleOf?: number;
  finite?: boolean;
  coerce?: boolean;
}): z.ZodNumber {
  try {
    let schema = options.coerce ? z.coerce.number() : z.number();

    if (options.min !== undefined) {
      const minOpt = options.min;
      if (minOpt !== null && minOpt !== undefined) {
        schema = minOpt.inclusive
          ? schema.min(minOpt.value, minOpt.message)
          : schema.gt(minOpt.value, minOpt.message);
      }
    }

    if (options.max !== undefined) {
      const maxOpt = options.max;
      if (maxOpt !== null && maxOpt !== undefined) {
        schema = maxOpt.inclusive
          ? schema.max(maxOpt.value, maxOpt.message)
          : schema.lt(maxOpt.value, maxOpt.message);
      }
    }

    if (options.int) {
      schema = schema.int();
    }

    if (options.multipleOf !== undefined && options.multipleOf !== null) {
      schema = schema.multipleOf(options.multipleOf);
    }

    if (options.finite) {
      schema = schema.finite();
    }

    return schema;
  } catch (error) {
    throw new ServiceError("buildNumberSchema failed", { cause: error });
  }
}

export function validateNumber(
  value: unknown,
  options: {
    min?: { value: number; inclusive: boolean; message?: string };
    max?: { value: number; inclusive: boolean; message?: string };
    int?: boolean;
    multipleOf?: number;
    finite?: boolean;
    coerce?: boolean;
  } = {}
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  try {
    const schema = buildNumberSchema(options);
    const result = schema.safeParse(value);

    if (!result.success) {
      return { success: false, errors: result.error.issues };
    }

    return { success: true, data: result.data };
  } catch (error) {
    throw new ServiceError("validateNumber failed", { cause: error });
  }
}

export { parseZodNumber, createZodNumberWithFixedParse, ServiceError };