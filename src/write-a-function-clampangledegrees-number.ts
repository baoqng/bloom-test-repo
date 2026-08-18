// bloom-deps:

function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || !isFinite(degrees)) {
    throw new TypeError('Input must be a finite number');
  }
  return ((degrees % 360) + 360) % 360;
}

export { clampAngle };