// bloom-deps:

function sumPositive_11(arr: unknown[]): number {
  if (!Array.isArray(arr)) {
    return 0;
  }

  return arr.reduce((sum, item) => {
    if (typeof item === 'number' && item > 0) {
      return sum + item;
    }
    return sum;
  }, 0);
}

export { sumPositive_11 };