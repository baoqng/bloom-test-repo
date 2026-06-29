// bloom-deps:

export function validateAge(age: unknown): number {
  if (age === null || age === undefined) {
    throw new TypeError('age is required');
  }
  if (typeof age !== 'number') {
    throw new TypeError('age must be a number');
  }
  if (!Number.isInteger(age)) {
    throw new TypeError('age must be an integer');
  }
  if (age < 0) {
    throw new RangeError('age must be non-negative');
  }
  if (age > 150) {
    throw new RangeError('age cannot exceed 150');
  }
  return age;
}