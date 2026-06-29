// bloom-deps:

export function sumArray(numbers: unknown): number {
  if (numbers === null || numbers === undefined) {
    throw new TypeError('numbers is required');
  }

  if (!Array.isArray(numbers)) {
    throw new TypeError('numbers must be an Array');
  }

  if (numbers.length === 0) {
    return 0;
  }

  let sum = 0;

  for (const element of numbers) {
    if (element === null || element === undefined) {
      throw new TypeError('array contains null or undefined element');
    }

    if (typeof element !== 'number') {
      throw new TypeError('all elements must be numbers');
    }

    sum += element;
  }

  return sum;
}