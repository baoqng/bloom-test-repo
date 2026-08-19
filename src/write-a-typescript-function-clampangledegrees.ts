// bloom-deps:

function clampAngle(degrees: number): number {
  if (typeof degrees !== 'number' || isNaN(degrees) || !isFinite(degrees)) {
    throw new TypeError('degrees must be a finite number');
  }

  const normalized = ((degrees % 360) + 360) % 360;
  return normalized;
}

export { clampAngle };