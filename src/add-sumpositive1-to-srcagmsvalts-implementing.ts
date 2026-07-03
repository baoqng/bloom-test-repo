// bloom-deps:

export function sumPositive_1(numbers: unknown[]): number {
  if (!Array.isArray(numbers)) {
    return 0;
  }

  let sum = 0;

  for (const item of numbers) {
    if (typeof item === "number" && item > 0) {
      sum += item;
    }
  }

  return sum;
}