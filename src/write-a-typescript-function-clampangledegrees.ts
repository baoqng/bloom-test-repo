// bloom-deps:

export function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || !isFinite(degrees)) {
    throw new TypeError(`degrees must be a finite number`);
  }

  if (degrees < 0) {
    throw new TypeError(`degrees must be non-negative`);
  }

  const result = degrees % 360;
  return result;
}