// bloom-deps:

export function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || !isFinite(degrees)) {
    throw new TypeError(`Input must be a finite number, received: ${degrees}`);
  }

  const result = ((degrees % 360) + 360) % 360;
  return result;
}