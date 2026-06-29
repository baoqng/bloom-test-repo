// bloom-deps:

export function parsePositiveInteger(input: unknown): number {
  if (input === null || input === undefined) {
    throw new TypeError('input is required');
  }

  if (typeof input !== 'number' && typeof input !== 'string') {
    throw new TypeError('input must be a number or numeric string');
  }

  const result = Number(input);

  if (isNaN(result)) {
    throw new TypeError('input is not a valid number');
  }

  if (!Number.isInteger(result)) {
    throw new TypeError('input must be an integer');
  }

  if (result <= 0) {
    throw new RangeError('value must be a positive integer');
  }

  return result;
}