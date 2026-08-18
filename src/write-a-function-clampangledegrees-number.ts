// bloom-deps:

export function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || !Number.isFinite(degrees)) {
    throw new TypeError(`Input must be a finite number, got: ${degrees}`);
  }

  const result = ((degrees % 360) + 360) % 360;
  return result;
}