// bloom-deps:

function clampAngle(deg: number): number {
  if (typeof deg !== 'number' || !Number.isFinite(deg)) {
    throw new TypeError(`Expected a finite number, got ${typeof deg === 'number' ? deg : typeof deg}`);
  }

  const result = ((deg % 360) + 360) % 360;
  return result;
}

export { clampAngle };