// bloom-deps: zod@^3

import { ZodNumber } from 'zod';
import { ZodIssueCode } from 'zod';
import type { ParseInput } from 'zod';

/**
 * Fixed implementation of ZodNumber._parse()
 * Properly validates numeric ranges with inclusive/exclusive boundary checks
 */
export class FixedZodNumber extends ZodNumber {
  _parse(input: ParseInput): any {
    if (input.data === null || input.data === undefined) {
      const isType = this._typeCheck(input.data);
      const ctx = {
        common: input,
        data: input.data,
        parsedType: typeof input.data,
      };

      if (!isType) {
        addProblem(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: 'number',
          message: this._def.errorMap?.({ code: 'invalid_type', expected: 'number', received: typeof input.data })?.message,
        });
        return INVALID;
      }
    }

    let ctx: any;
    const parsedType = getParsedType(input.data);

    if (parsedType !== ZodParsedType.number) {
      ctx = {
        common: input,
        data: input.data,
        parsedType: parsedType,
      };
      addProblem(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: 'number',
        received: parsedType,
      });
      return INVALID;
    }

    let status = { ok: true, data: input.data as number };
    const data: number = input.data;

    ctx = {
      common: input,
      data: data,
    };

    // Iterate over all checks in this._def.checks
    if (this._def.checks) {
      for (const check of this._def.checks) {
        if (check.kind === 'min') {
          // For min: exclude if (inclusive && value < min) or (!inclusive && value <= min)
          if (check.inclusive ? data < check.value : data <= check.value) {
            addProblem(ctx, {
              code: ZodIssueCode.too_small,
              type: 'number',
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message ?? undefined,
            });
            status.ok = false;
          }
        } else if (check.kind === 'max') {
          // For max: exclude if (inclusive && value > max) or (!inclusive && value >= max)
          if (check.inclusive ? data > check.value : data >= check.value) {
            addProblem(ctx, {
              code: ZodIssueCode.too_big,
              type: 'number',
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message ?? undefined,
            });
            status.ok = false;
          }
        }
      }
    }

    return { status: status.ok ? 'valid' : 'invalid', data: status.data };
  }

  private _typeCheck(data: any): boolean {
    return typeof data === 'number' && !isNaN(data);
  }
}

// Helper types and functions for the implementation
enum ZodParsedType {
  string = 'string',
  number = 'number',
  bigint = 'bigint',
  boolean = 'boolean',
  date = 'date',
  bigint_coerce = 'bigint',
  symbol = 'symbol',
  function = 'function',
  undefined = 'undefined',
  null = 'null',
  array = 'array',
  object = 'object',
  unknown = 'unknown',
  promise = 'promise',
  void = 'void',
  never = 'never',
  nan = 'nan',
}

function getParsedType(data: any): ZodParsedType {
  const type = typeof data;

  if (type === 'string') return ZodParsedType.string;
  if (type === 'number') {
    if (isNaN(data)) return ZodParsedType.nan;
    return ZodParsedType.number;
  }
  if (type === 'bigint') return ZodParsedType.bigint;
  if (type === 'boolean') return ZodParsedType.boolean;
  if (type === 'function') return ZodParsedType.function;
  if (type === 'symbol') return ZodParsedType.symbol;
  if (type === 'undefined') return ZodParsedType.undefined;
  if (data === null) return ZodParsedType.null;
  if (data instanceof Date) return ZodParsedType.date;
  if (data instanceof Promise) return ZodParsedType.promise;
  if (Array.isArray(data)) return ZodParsedType.array;
  if (data instanceof Map) return ZodParsedType.object;
  if (data instanceof Set) return ZodParsedType.object;
  if (type === 'object') return ZodParsedType.object;

  return ZodParsedType.unknown;
}

interface ParseContext {
  common: ParseInput;
  data: any;
  parsedType?: ZodParsedType | string;
}

function addProblem(
  ctx: ParseContext,
  problem: {
    code: ZodIssueCode;
    expected?: string;
    received?: string | ZodParsedType;
    message?: string;
    type?: string;
    minimum?: number;
    maximum?: number;
    inclusive?: boolean;
  }
): void {
  // Implementation would add the issue to ctx.common.issues
  // This is a placeholder for the actual Zod implementation
  if (!ctx.common.issues) {
    (ctx.common as any).issues = [];
  }
  (ctx.common as any).issues.push({
    code: problem.code,
    expected: problem.expected,
    received: problem.received,
    message: problem.message,
    type: problem.type,
    minimum: problem.minimum,
    maximum: problem.maximum,
    inclusive: problem.inclusive,
  });
}

const INVALID = { status: 'invalid' };

export default FixedZodNumber;