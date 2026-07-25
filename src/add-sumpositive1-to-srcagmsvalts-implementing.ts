// bloom-deps:

export function sumPositive_1(arr: unknown[]): number {
  try {
    if (!Array.isArray(arr)) {
      throw new Error('Input must be an array');
    }

    let sum = 0;
    for (const item of arr) {
      const num = Number(item);
      if (!isNaN(num) && num > 0) {
        sum += num;
      }
    }
    return sum;
  } catch (error) {
    throw new Error(`Failed to sum positive numbers: ${error instanceof Error ? error.message : String(error)}`);
  }
}