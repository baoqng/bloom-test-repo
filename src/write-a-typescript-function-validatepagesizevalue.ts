// bloom-deps:

export function validatePageSize(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 1000
  ) {
    throw new TypeError('Page size must be a positive integer');
  }
  return value;
}