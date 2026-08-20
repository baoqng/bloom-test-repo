// bloom-deps:

function truncate(str: string, maxLength: number, ellipsis: string = '...'): string {
  if (typeof str !== 'string') {
    throw new TypeError('str must be a string');
  }
  if (typeof maxLength !== 'number' || !Number.isFinite(maxLength) || !Number.isInteger(maxLength)) {
    throw new TypeError('maxLength must be a finite integer');
  }
  if (typeof ellipsis !== 'string') {
    throw new TypeError('ellipsis must be a string');
  }
  if (maxLength < ellipsis.length) {
    throw new TypeError('maxLength must be greater than or equal to ellipsis.length');
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

export { truncate };