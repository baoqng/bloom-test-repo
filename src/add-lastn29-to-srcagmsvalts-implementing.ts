export function lastN_29(array: unknown[], n: number): unknown[] {
  if (!Array.isArray(array)) {
    return [];
  }

  if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
    return [];
  }

  if (n === 0) {
    return [];
  }

  const length = array.length;
  if (n >= length) {
    return array;
  }

  return array.slice(length - n);
}