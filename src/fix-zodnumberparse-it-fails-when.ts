// bloom-deps: zod@^3

import { z } from 'zod';

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

function parseZodNumber(schema: z.ZodNumber, input: unknown): z.SafeParseReturnType<number, number> {
  try {
    const result = schema.safeParse(input);
    
    // Reject Infinity and -Infinity
    if (result.success && !isFinite(result.data)) {
      return {
        success: false,
        error: z.ZodError.create([
          {
            code: 'invalid_type' as const,
            expected: 'finite number',
            received: 'nan',
            path: [],
            message: 'Expected a finite number',
          },
        ]),
      };
    }
    
    return result;
  } catch (error) {
    throw new ServiceError('operation failed', { cause: error });
  }
}

class ZodNumberValidator {
  private schema: z.ZodNumber;

  constructor() {
    this.schema = z.number().finite();
  }

  min(value: number, inclusive = true): this {
    this.schema = inclusive ? this.schema.min(value) : this.schema.gt(value);
    return this;
  }

  max(value: number, inclusive = true): this {
    this.schema = inclusive ? this.schema.max(value) : this.schema.lt(value);
    return this;
  }

  parse(input: unknown): z.SafeParseReturnType<number, number> {
    try {
      return this.schema.safeParse(input);
    } catch (error) {
      throw new ServiceError('operation failed', { cause: error });
    }
  }
}

function createZodNumberWithChecks(checks: Array<
  | { kind: 'min'; value: number; inclusive: boolean; message?: string }
  | { kind: 'max'; value: number; inclusive: boolean; message?: string }
>): z.ZodNumber {
  try {
    let schema = z.number().finite();

    for (const check of checks) {
      if (check.kind === 'min') {
        if (check.inclusive) {
          schema = schema.min(check.value, check.message);
        } else {
          schema = schema.gt(check.value, check.message);
        }
      } else if (check.kind === 'max') {
        if (check.inclusive) {
          schema = schema.max(check.value, check.message);
        } else {
          schema = schema.lt(check.value, check.message);
        }
      }
    }

    return schema;
  } catch (error) {
    throw new ServiceError('operation failed', { cause: error });
  }
}

function validateNumberWithBoundary(
  value: unknown,
  checks: Array<
    | { kind: 'min'; value: number; inclusive: boolean }
    | { kind: 'max'; value: number; inclusive: boolean }
  >
): { success: true; data: number } | { success: false; errors: z.ZodIssue[] } {
  try {
    if (typeof value !== 'number' || !isFinite(value)) {
      return {
        success: false,
        errors: [
          {
            code: 'invalid_type' as const,
            expected: 'number',
            received: typeof value === 'number' && !isFinite(value) ? 'nan' : (typeof value as z.ZodParsedType),
            path: [],
            message: 'Expected number',
          },
        ],
      };
    }

    const issues: z.ZodIssue[] = [];

    for (const check of checks) {
      if (check.kind === 'min') {
        const tooSmall = check.inclusive ? value < check.value : value <= check.value;
        if (tooSmall) {
          issues.push({
            code: 'too_small' as const,
            type: 'number',
            minimum: check.value,
            inclusive: check.inclusive,
            path: [],
            message: check.inclusive
              ? `Number must be greater than or equal to ${check.value}`
              : `Number must be greater than ${check.value}`,
          });
        }
      } else if (check.kind === 'max') {
        const tooBig = check.inclusive ? value > check.value : value >= check.value;
        if (tooBig) {
          issues.push({
            code: 'too_big' as const,
            type: 'number',
            maximum: check.value,
            inclusive: check.inclusive,
            path: [],
            message: check.inclusive
              ? `Number must be less than or equal to ${check.value}`
              : `Number must be less than ${check.value}`,
          });
        }
      }
    }

    if (issues.length > 0) {
      return { success: false, errors: issues };
    }

    return { success: true, data: value };
  } catch (error) {
    throw new ServiceError('operation failed', { cause: error });
  }
}

function filterByMinimumScore(scores: number[], minimumThreshold: number): number[] {
  try {
    if (!Array.isArray(scores)) {
      throw new Error('scores must be an array');
    }
    return scores.filter(num => typeof num === 'number' && num >= minimumThreshold);
  } catch (error) {
    throw new ServiceError('operation failed', { cause: error });
  }
}

function filterByMaxThreshold(numbers: number[], maxThreshold: number): number[] {
  try {
    if (!Array.isArray(numbers)) {
      throw new Error('numbers must be an array');
    }
    return numbers.filter(num => typeof num === 'number' && num <= maxThreshold);
  } catch (error) {
    throw new ServiceError('operation failed', { cause: error });
  }
}

function isValidPrice(price: number, minPrice: number): boolean {
  try {
    if (typeof price !== 'number' || typeof minPrice !== 'number') {
      return false;
    }
    return price >= minPrice;
  } catch (error) {
    throw new ServiceError('operation failed', { cause: error });
  }
}

export {
  ServiceError,
  ZodNumberValidator,
  createZodNumberWithChecks,
  validateNumberWithBoundary,
  parseZodNumber,
  filterByMinimumScore,
  filterByMaxThreshold,
  isValidPrice,
};