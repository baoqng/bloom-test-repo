// bloom-deps:

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface SortResult<T> {
  success: boolean;
  data?: T[];
  errors?: ValidationError[];
}

function validateArray(arr: unknown): arr is unknown[] {
  return Array.isArray(arr);
}

function validateFunction(fn: unknown): fn is Function {
  return typeof fn === 'function';
}

function validateDirection(direction: unknown): direction is 'asc' | 'desc' {
  return direction === 'asc' || direction === 'desc';
}

function validateInputs<T>(
  arr: unknown,
  keyFn: unknown,
  direction: unknown
): SortResult<T> {
  const errors: ValidationError[] = [];

  if (!validateArray(arr)) {
    errors.push({
      field: 'arr',
      message: 'arr must be an Array',
      code: 'INVALID_TYPE'
    });
  }

  if (!validateFunction(keyFn)) {
    errors.push({
      field: 'keyFn',
      message: 'keyFn must be a function',
      code: 'INVALID_TYPE'
    });
  }

  if (direction !== undefined && !validateDirection(direction)) {
    errors.push({
      field: 'direction',
      message: "direction must be 'asc' or 'desc'",
      code: 'INVALID_VALUE'
    });
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors
    };
  }

  return {
    success: true
  };
}

function sortBy<T>(
  arr: T[],
  keyFn: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  const validationResult = validateInputs<T>(arr, keyFn, direction);

  if (!validationResult.success) {
    const errorMessages = validationResult.errors
      ?.map((e) => `${e.field}: ${e.message}`)
      .join('; ');

    if (
      validationResult.errors?.some((e) => e.code === 'INVALID_TYPE') &&
      !validateArray(arr)
    ) {
      throw new TypeError(`Invalid input: ${errorMessages}`);
    }

    if (
      validationResult.errors?.some((e) => e.code === 'INVALID_TYPE') &&
      !validateFunction(keyFn)
    ) {
      throw new TypeError(`Invalid input: ${errorMessages}`);
    }

    if (validationResult.errors?.some((e) => e.code === 'INVALID_VALUE')) {
      throw new RangeError(`Invalid input: ${errorMessages}`);
    }

    throw new Error(`Invalid input: ${errorMessages}`);
  }

  const shallowCopy = [...arr];

  shallowCopy.sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    if (typeof keyA !== 'string' && typeof keyA !== 'number') {
      throw new TypeError(
        `keyFn must return a string or number, got ${typeof keyA}`
      );
    }

    if (typeof keyB !== 'string' && typeof keyB !== 'number') {
      throw new TypeError(
        `keyFn must return a string or number, got ${typeof keyB}`
      );
    }

    let comparison = 0;

    if (keyA < keyB) {
      comparison = -1;
    } else if (keyA > keyB) {
      comparison = 1;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return shallowCopy;
}

export { sortBy, ValidationError, SortResult };