// bloom-deps:

function truncateString(str: string, maxLength: number): string {
  if (typeof str !== 'string') {
    throw new TypeError('str must be a string');
  }
  if (!Number.isInteger(maxLength) || maxLength < 3) {
    throw new RangeError('maxLength must be a positive integer greater than or equal to 3');
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}

export { truncateString };