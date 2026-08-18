// bloom-deps:

export function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || !Number.isFinite(degrees)) {
    throw new TypeError(`Expected a finite number, got ${degrees}`);
  }

  const result = degrees % 360;
  return result < 0 ? result + 360 : result;
}