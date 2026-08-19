// bloom-deps:

function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || isNaN(degrees) || !isFinite(degrees)) {
    throw new TypeError('degrees must be a finite number');
  }

  const result = ((degrees % 360) + 360) % 360;
  return result;
}

export { clampAngle };