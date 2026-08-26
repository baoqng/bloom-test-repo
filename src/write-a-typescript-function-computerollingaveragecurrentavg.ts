// bloom-deps:

export function computeRollingAverage(
  currentAvg: unknown,
  currentCount: unknown,
  newValue: unknown
): { newAvg: number; newCount: number } {
  if (
    typeof currentAvg !== "number" ||
    !Number.isFinite(currentAvg)
  ) {
    throw new TypeError("currentAvg must be a finite number");
  }

  if (
    typeof currentCount !== "number" ||
    !Number.isFinite(currentCount) ||
    !Number.isInteger(currentCount) ||
    currentCount < 0
  ) {
    throw new TypeError("currentCount must be a non-negative integer");
  }

  if (
    typeof newValue !== "number" ||
    !Number.isFinite(newValue)
  ) {
    throw new TypeError("newValue must be a finite number");
  }

  const newCount = currentCount + 1;
  const newAvg = currentAvg + (newValue - currentAvg) / newCount;

  return { newAvg, newCount };
}