// bloom-deps:

export function clampNumber(value: unknown, min: number, max: number): number {
  if (value === null || value === undefined) {
    return min;
  }

  if (typeof value !== 'number') {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return min;
    }
    return Math.min(Math.max(parsed, min), max);
  }

  if (isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}