// bloom-deps:

export function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || isNaN(degrees) || !isFinite(degrees)) {
    throw new TypeError(`degrees must be a finite number`);
  }

  if (degrees < 0) {
    throw new TypeError(`degrees must be a non-negative number`);
  }

  const mod = degrees % 360;
  return mod;
}