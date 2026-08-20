// bloom-deps:

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }
  if (!Number.isFinite(min)) {
    throw new TypeError('min must be a finite number');
  }
  if (!Number.isFinite(max)) {
    throw new TypeError('max must be a finite number');
  }

  if (value < min) return min;
  if (value > max) return max;
  return value;
}