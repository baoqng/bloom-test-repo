// bloom-deps:

export function validateAge(age: unknown): number {
  if (typeof age !== 'number' || Number.isNaN(age)) {
    throw new TypeError('Age must be a valid number');
  }
  if (age < 0) {
    throw new RangeError('Age must not be negative');
  }
  if (age > 150) {
    throw new RangeError('Age must not be greater than 150');
  }
  return age;
}