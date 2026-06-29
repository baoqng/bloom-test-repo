// bloom-deps:

export function formatFullName(firstName: unknown, lastName: unknown): string {
  if (firstName === null || firstName === undefined) {
    throw new TypeError('firstName is required');
  }
  if (lastName === null || lastName === undefined) {
    throw new TypeError('lastName is required');
  }
  if (typeof firstName !== 'string') {
    throw new TypeError('firstName must be a string');
  }
  if (typeof lastName !== 'string') {
    throw new TypeError('lastName must be a string');
  }
  if (firstName.trim() === '') {
    throw new TypeError('firstName cannot be empty');
  }
  if (lastName.trim() === '') {
    throw new TypeError('lastName cannot be empty');
  }
  return firstName.trim() + ' ' + lastName.trim();
}