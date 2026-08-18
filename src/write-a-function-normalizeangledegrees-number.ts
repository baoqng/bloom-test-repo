// bloom-deps:

export function normalizeAngle(degrees: number): number {
  if (typeof degrees !== 'number' || !isFinite(degrees)) {
    throw new TypeError(`Expected a finite number, got ${degrees}`);
  }

  const result = ((degrees % 360) + 360) % 360;
  return result;
}