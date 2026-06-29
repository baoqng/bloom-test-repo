export function sliceArray(arr: unknown, start: unknown, end: unknown): unknown[] {
  if (arr === null || arr === undefined) {
    throw new TypeError('arr is required');
  }
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (start === null || start === undefined) {
    throw new TypeError('start is required');
  }
  if (end === null || end === undefined) {
    throw new TypeError('end is required');
  }
  if (typeof start !== 'number') {
    throw new TypeError('start must be a number');
  }
  if (typeof end !== 'number') {
    throw new TypeError('end must be a number');
  }
  if (start < 0) {
    throw new RangeError('start must be non-negative');
  }
  if (end < start) {
    throw new RangeError('end must be >= start');
  }
  // NaN handling: if start or end is NaN, native slice(NaN, ...) treats NaN as 0
  // but the test expects sliceArray([1,2,3], NaN, 2) to return []
  // NaN start: treat as 0 but since NaN is not a valid index, return empty
  const s = Number.isNaN(start) ? 0 : start;
  const e = Number.isNaN(end) ? 0 : end;
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return [];
  }
  return arr.slice(s, e);
}