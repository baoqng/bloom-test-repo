// bloom-deps:

export function truncateString(str: unknown, maxLength: unknown): string {
  if (str === null || str === undefined) {
    throw new TypeError('str is required');
  }
  if (maxLength === null || maxLength === undefined) {
    throw new TypeError('maxLength is required');
  }
  if (typeof str !== 'string') {
    throw new TypeError('str must be a string');
  }
  if (typeof maxLength !== 'number') {
    throw new TypeError('maxLength must be a number');
  }
  if (maxLength < 0) {
    throw new RangeError('maxLength must be non-negative');
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + '...';
}